import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: Record<string, unknown>;
  old_record: Record<string, unknown> | null;
}

interface PushToken {
  device_token: string;
  user_id: string;
}

// Generate APNs JWT from .p8 key
async function generateAPNsJWT(): Promise<string> {
  const keyId = Deno.env.get("APNS_KEY_ID")!;
  const teamId = Deno.env.get("APNS_TEAM_ID")!;
  const privateKeyPem = Deno.env.get("APNS_PRIVATE_KEY")!;

  const header = { alg: "ES256", kid: keyId };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: teamId, iat: now };

  const encode = (obj: Record<string, unknown>) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const headerB64 = encode(header);
  const payloadB64 = encode(payload);
  const signingInput = `${headerB64}.${payloadB64}`;

  // Parse the PEM private key
  const pemBody = privateKeyPem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const keyData = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(signingInput)
  );

  // Convert DER signature to raw r||s format for JWT
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${signingInput}.${sigB64}`;
}

async function sendPush(
  token: string,
  title: string,
  body: string,
  jwt: string
): Promise<void> {
  const isProduction = Deno.env.get("APNS_PRODUCTION") === "true";
  const host = isProduction
    ? "api.push.apple.com"
    : "api.sandbox.push.apple.com";

  const apnsPayload = {
    aps: {
      alert: { title, body },
      sound: "default",
      "mutable-content": 1,
    },
  };

  try {
    const res = await fetch(`https://${host}/3/device/${token}`, {
      method: "POST",
      headers: {
        authorization: `bearer ${jwt}`,
        "apns-topic": "com.pup.app",
        "apns-push-type": "alert",
        "apns-priority": "10",
        "content-type": "application/json",
      },
      body: JSON.stringify(apnsPayload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`APNs error for token ${token.slice(0, 8)}...: ${res.status} ${err}`);
    }
  } catch (e) {
    console.error(`Failed to send push to ${token.slice(0, 8)}...:`, e);
  }
}

serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json();
    const { type, record, old_record } = payload;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let title = "";
    let body = "";
    let targetUserIds: string[] = [];

    const ticketTitle =
      (record.title as string) || "Untitled ticket";

    if (type === "INSERT") {
      // New ticket created — notify everyone except the creator
      title = "New Ticket";
      body = `${(record.created_by as string) || "Someone"} created: ${ticketTitle}`;

      const { data: allTokens } = await supabase
        .from("push_tokens")
        .select("device_token, user_id")
        .neq("user_id", record.user_id as string);

      if (allTokens && allTokens.length > 0) {
        const jwt = await generateAPNsJWT();
        await Promise.all(
          allTokens.map((t: PushToken) => sendPush(t.device_token, title, body, jwt))
        );
      }

      return new Response(JSON.stringify({ sent: allTokens?.length ?? 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (type === "UPDATE" && old_record) {
      const oldStatus = old_record.status as string;
      const newStatus = record.status as string;
      const oldAssigned = old_record.assigned_to as string | null;
      const newAssigned = record.assigned_to as string | null;

      // Ticket completed — notify the creator
      if (
        oldStatus !== newStatus &&
        (newStatus === "done" || newStatus === "closed")
      ) {
        title = "Ticket Completed";
        body = `"${ticketTitle}" was marked as ${newStatus}`;
        targetUserIds = [record.user_id as string];
      }
      // Ticket assigned — notify the assignee
      else if (oldAssigned !== newAssigned && newAssigned) {
        title = "Ticket Assigned to You";
        body = `You were assigned: ${ticketTitle}`;

        // assigned_to stores email — look up user by email
        const { data: assignedUser } = await supabase
          .from("push_tokens")
          .select("device_token, user_id")
          .limit(100);

        // We need to find the user by email. Query auth.users via get_users rpc
        const { data: users } = await supabase.rpc("get_users");
        const matchedUser = users?.find(
          (u: { email: string }) => u.email === newAssigned
        );

        if (matchedUser && assignedUser) {
          const tokens = assignedUser.filter(
            (t: PushToken) => t.user_id === matchedUser.id
          );
          if (tokens.length > 0) {
            const jwt = await generateAPNsJWT();
            await Promise.all(
              tokens.map((t: PushToken) => sendPush(t.device_token, title, body, jwt))
            );
          }
          return new Response(JSON.stringify({ sent: tokens.length }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ sent: 0 }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      // Other update — no notification
      else {
        return new Response(JSON.stringify({ sent: 0, reason: "no matching rule" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Send to target users (for the "completed" case)
      if (targetUserIds.length > 0) {
        const { data: tokens } = await supabase
          .from("push_tokens")
          .select("device_token, user_id")
          .in("user_id", targetUserIds);

        if (tokens && tokens.length > 0) {
          const jwt = await generateAPNsJWT();
          await Promise.all(
            tokens.map((t: PushToken) => sendPush(t.device_token, title, body, jwt))
          );
        }

        return new Response(JSON.stringify({ sent: tokens?.length ?? 0 }), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ sent: 0, reason: "unhandled" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Push notification function error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
