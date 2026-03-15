import Foundation
import UserNotifications
import UIKit
import Supabase

// Set to true once enrolled in the paid Apple Developer Program.
// Push notifications require the APNs entitlement which is unavailable
// on personal (free) development teams.
let pushNotificationsAvailable = false

@Observable
final class NotificationManager: NSObject {
    private(set) var isAuthorized = false
    private(set) var deviceToken: String?

    /// User-controlled opt-out. When false, the device token is removed
    /// from the server so no pushes are delivered, even if OS permission is granted.
    var pushEnabled: Bool {
        get { pushNotificationsAvailable && UserDefaults.standard.bool(forKey: "pushEnabled") }
        set {
            guard pushNotificationsAvailable else { return }
            UserDefaults.standard.set(newValue, forKey: "pushEnabled")
            Task {
                if newValue {
                    await reregisterToken()
                } else {
                    await removeToken()
                }
            }
        }
    }

    private var authManager: AuthManager?

    func configure(auth: AuthManager) {
        self.authManager = auth
        if UserDefaults.standard.object(forKey: "pushEnabled") == nil {
            UserDefaults.standard.set(true, forKey: "pushEnabled")
        }
    }

    @MainActor
    func requestPermission() async {
        guard pushNotificationsAvailable else { return }
        let center = UNUserNotificationCenter.current()
        do {
            let granted = try await center.requestAuthorization(options: [.alert, .sound, .badge])
            isAuthorized = granted
            if granted {
                UIApplication.shared.registerForRemoteNotifications()
            }
        } catch {
            print("Notification permission error: \(error)")
        }
    }

    func handleDeviceToken(_ tokenData: Data) {
        guard pushNotificationsAvailable else { return }
        let token = tokenData.map { String(format: "%02x", $0) }.joined()
        self.deviceToken = token
        if pushEnabled {
            Task { await upsertToken(token) }
        }
    }

    func handleRegistrationError(_ error: Error) {
        print("Failed to register for remote notifications: \(error)")
    }

    func removeToken() async {
        guard pushNotificationsAvailable else { return }
        guard let token = deviceToken, let auth = authManager, let userId = auth.userId else { return }
        do {
            try await auth.client
                .from("push_tokens")
                .delete()
                .eq("user_id", value: userId)
                .eq("device_token", value: token)
                .execute()
            self.deviceToken = nil
        } catch {
            print("Failed to remove push token: \(error)")
        }
    }

    @MainActor
    private func reregisterToken() async {
        guard pushNotificationsAvailable else { return }
        if let token = deviceToken {
            await upsertToken(token)
        } else {
            UIApplication.shared.registerForRemoteNotifications()
        }
    }

    private func upsertToken(_ token: String) async {
        guard let auth = authManager, let userId = auth.userId else { return }

        struct PushTokenPayload: Encodable {
            let userId: String
            let deviceToken: String
            let platform: String
            let updatedAt: String

            enum CodingKeys: String, CodingKey {
                case userId = "user_id"
                case deviceToken = "device_token"
                case platform
                case updatedAt = "updated_at"
            }
        }

        let payload = PushTokenPayload(
            userId: userId,
            deviceToken: token,
            platform: "ios",
            updatedAt: ISO8601DateFormatter().string(from: Date())
        )

        do {
            try await auth.client
                .from("push_tokens")
                .upsert(payload, onConflict: "user_id,device_token")
                .execute()
        } catch {
            print("Failed to upsert push token: \(error)")
        }
    }
}
