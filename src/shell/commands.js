/**
 * The command table.
 *
 * Every command is a pure-ish function of `(args, ctx)` that pushes lines into
 * the scrollback. Side effects the shell cannot own itself — routing, the
 * clipboard, the palette — arrive through `ctx`, so this file stays testable
 * and has no React in it.
 *
 * `ctx` = {
 *   cwd, setCwd, jumpBack,        // navigation
 *   print, clear, history,        // output
 *   navigate, closeShell,         // the page
 *   themes, themeId, setTheme,
 * }
 */

import { profile, siteIndex, indexGroups } from "../Data";
import {
  L,
  displayPath,
  formatSize,
  lineText,
  nodeSize,
  resolveLoose,
  resolvePath,
  root,
  walkAll,
  walkFiles,
} from "./filesystem";

/* ------------------------------------------------------------------
   shared helpers
   ------------------------------------------------------------------ */

const noSuch = (command, target, failedAt) => [
  L.error(
    `${command}: ${target || "(nothing)"}: no such file or directory${
      failedAt && failedAt !== target ? ` (stopped at "${failedAt}")` : ""
    }`
  ),
];

/**
 * Resolve or print the error. Returns `{ node, segments }`, or null if it
 * already printed a diagnosis.
 */
const need = (ctx, command, target, { type } = {}) => {
  if (!target) {
    ctx.print([L.error(`${command}: needs a path. try \`${command} .\``)]);
    return null;
  }

  const { node, segments, failedAt, ambiguous } = resolveLoose(ctx.cwd, target);

  if (ambiguous) {
    ctx.print([
      L.error(`${command}: ${target}: ambiguous — ${ambiguous.length} matches`),
      ...ambiguous.map((path) => L.out(`  ${path}`)),
    ]);
    return null;
  }

  if (!node) {
    ctx.print(noSuch(command, target, failedAt));
    return null;
  }

  if (type && node.type !== type) {
    ctx.print([
      L.error(
        type === "file"
          ? `${command}: ${target}: is a directory — try \`ls ${target}\``
          : `${command}: ${target}: is a file — try \`cat ${target}\``
      ),
    ]);
    return null;
  }

  return { node, segments };
};

/** Split `-l`-style flags off the positional arguments. */
const flagged = (args) => ({
  rest: args.filter((arg) => !arg.startsWith("-")),
  has: (flag) => args.includes(flag),
});

/** Roles, not schooling — a degree is not a deployment. */
const roleCount = siteIndex.filter(
  (entry) => entry.group === "work" && entry.track !== "education"
).length;

/** Whole years only. Precision here would be false precision. */
const yearsShipping = () => new Date().getFullYear() - profile.since;

/* ------------------------------------------------------------------
   commands
   ------------------------------------------------------------------ */

const ls = {
  name: "ls",
  usage: "ls [-l] [path]",
  summary: "list a directory",
  group: "navigate",
  run: (args, ctx) => {
    const { rest, has } = flagged(args);
    const found = need(ctx, "ls", rest[0] ?? ".");
    if (!found) return;

    const { node, segments } = found;

    if (node.type === "file") {
      ctx.print([L.kv(formatSize(nodeSize(node)), node.name)]);
      return;
    }

    if (!node.children.length) {
      ctx.print([L.dim("empty")]);
      return;
    }

    const label = (child) =>
      `${child.name}${child.type === "dir" ? "/" : ""}`;

    if (has("-l") || has("-la") || has("-al")) {
      // Monospace, so the notes only line up if the names are padded to the
      // widest one in this directory.
      const column =
        Math.max(...node.children.map((child) => label(child).length)) + 3;

      ctx.print(
        node.children.map((child) =>
          L.kv(
            child.type === "dir"
              ? `d  ${String(child.children.length).padStart(4)}`
              : `-  ${formatSize(nodeSize(child)).padStart(4)}`,
            `${label(child).padEnd(column)}${child.note ?? ""}`.trimEnd()
          )
        )
      );
      return;
    }

    ctx.print([
      L.listing(
        node.children.map((child) => ({
          name: label(child),
          type: child.type,
          target: [...segments, child.name].join("/"),
        }))
      ),
    ]);
  },
};

const cd = {
  name: "cd",
  usage: "cd [path | .. | - | ~]",
  summary: "change directory",
  group: "navigate",
  run: (args, ctx) => {
    const target = args[0];

    if (!target || target === "~" || target === "/") {
      ctx.setCwd([]);
      return;
    }

    if (target === "-") {
      ctx.jumpBack();
      return;
    }

    const found = need(ctx, "cd", target, { type: "dir" });
    if (!found) return;
    ctx.setCwd(found.segments);
  },
};

const pwd = {
  name: "pwd",
  usage: "pwd",
  summary: "print the working directory",
  group: "navigate",
  run: (_args, ctx) => ctx.print([L.out(displayPath(ctx.cwd))]),
};

const cat = {
  name: "cat",
  aliases: ["less", "more", "read"],
  usage: "cat <file>",
  summary: "read a file — refs and partial names work",
  group: "read",
  run: (args, ctx) => {
    const found = need(ctx, "cat", args[0], { type: "file" });
    if (!found) return;
    ctx.print(found.node.lines);
  },
};

const tree = {
  name: "tree",
  usage: "tree [path]",
  summary: "the whole shape at once",
  group: "navigate",
  run: (args, ctx) => {
    const found = need(ctx, "tree", args[0] ?? ".", { type: "dir" });
    if (!found) return;

    const lines = [L.dim(displayPath(found.segments))];

    const walk = (current, prefix) => {
      current.children.forEach((child, i) => {
        const last = i === current.children.length - 1;
        lines.push(
          L.branch(
            `${prefix}${last ? "└─ " : "├─ "}`,
            `${child.name}${child.type === "dir" ? "/" : ""}`,
            child.type
          )
        );
        if (child.type === "dir") {
          walk(child, `${prefix}${last ? "   " : "│  "}`);
        }
      });
    };

    walk(found.node, "");
    ctx.print(lines);
  },
};

const open = {
  name: "open",
  aliases: ["o", "xdg-open"],
  usage: "open [-w] <path>",
  summary: "hand a file back to the page, or -w for the web",
  group: "read",
  run: (args, ctx) => {
    const { rest, has } = flagged(args);
    const web = has("-w") || has("--web");
    const found = need(ctx, "open", rest[0]);
    if (!found) return;
    const { node } = found;

    // Explicit PDFs and anything with its own href go straight out.
    if (node.href) {
      if (node.external || /^https?:/.test(node.href)) {
        window.open(node.href, "_blank", "noreferrer");
        ctx.print([L.dim(`opening ${node.href}`)]);
      } else {
        ctx.closeShell();
        ctx.navigate(node.href);
      }
      return;
    }

    if (web) {
      const link = node.lines?.find((line) => line.kind === "link");
      if (!link) {
        ctx.print([
          L.error(`open: ${node.name}: nothing public to open. try \`cat\``),
        ]);
        return;
      }
      if (link.internal) {
        ctx.closeShell();
        ctx.navigate(link.href);
      } else {
        window.open(link.href, "_blank", "noreferrer");
        ctx.print([L.dim(`opening ${link.href}`)]);
      }
      return;
    }

    // An entry file knows which catalogue row it came from, so it can send you
    // to that row on the page with it already expanded.
    if (node.entry) {
      ctx.closeShell();
      ctx.navigate(`/?entry=${node.entry}`);
      return;
    }

    if (node.route) {
      ctx.closeShell();
      ctx.navigate(node.route);
      return;
    }

    const path = displayPath(found.segments);
    ctx.print([
      L.error(
        node.type === "dir"
          ? `open: ${node.name}: no page for this one — try \`cd ${path}\``
          : `open: ${node.name}: no target — try \`cat ${path}\``
      ),
    ]);
  },
};

const grep = {
  name: "grep",
  usage: "grep <pattern> [path]",
  summary: "search everything, or one path",
  group: "read",
  run: (args, ctx) => {
    const [pattern, scope] = args;
    if (!pattern) {
      ctx.print([L.error("grep: needs a pattern. try `grep python`")]);
      return;
    }

    // Unlike a real grep this searches the whole tree by default. Someone
    // typing `grep foundry` wants to know whether the word appears in the CV
    // at all, not whether it appears in the directory they wandered into.
    const found = scope
      ? need(ctx, "grep", scope)
      : { node: root, segments: [] };
    if (!found) return;

    const needle = pattern.toLowerCase();
    const hits = [];

    // Path above, match below: file paths are far too long to share a column
    // with the line they matched.
    walkFiles(found.node, found.segments).forEach(({ path, node }) => {
      const matched = node.lines
        .map(lineText)
        .filter((text) => text.toLowerCase().includes(needle));

      if (!matched.length) return;

      hits.push(L.head(path));
      matched.forEach((text) =>
        hits.push(
          L.out(`  ${text.length > 120 ? `${text.slice(0, 120)}…` : text}`)
        )
      );
    });

    ctx.print(
      hits.length
        ? [
            ...hits,
            L.blank(),
            L.dim(
              `${hits.filter((line) => line.kind === "out").length} lines in ${
                hits.filter((line) => line.kind === "head").length
              } files`
            ),
          ]
        : [L.dim(`no matches for "${pattern}"`)]
    );
  },
};

const find = {
  name: "find",
  usage: "find <name>",
  summary: "locate a file by name",
  group: "read",
  run: (args, ctx) => {
    const needle = (args[0] ?? "").toLowerCase();
    if (!needle) {
      ctx.print([L.error("find: needs a name. try `find caching`")]);
      return;
    }

    const hits = walkAll().filter(({ path, node }) =>
      `${path} ${node.note ?? ""}`.toLowerCase().includes(needle)
    );

    ctx.print(
      hits.length
        ? hits.map(({ path, node }) =>
            L.out(`${path}${node.type === "dir" ? "/" : ""}`)
          )
        : [L.dim(`nothing named like "${args[0]}"`)]
    );
  },
};

const stat = {
  name: "stat",
  usage: "stat <path>",
  summary: "metadata for a node",
  group: "read",
  run: (args, ctx) => {
    const found = need(ctx, "stat", args[0]);
    if (!found) return;
    const { node } = found;

    const entry = node.entry
      ? siteIndex.find((item) => item.ref === node.entry)
      : undefined;

    ctx.print([
      L.kv("path", displayPath(found.segments)),
      L.kv("type", node.type === "dir" ? "directory" : "regular file"),
      L.kv(
        "size",
        node.type === "dir"
          ? `${node.children.length} children`
          : formatSize(nodeSize(node))
      ),
      L.kv("mode", "r--r--r--  (read-only, obviously)"),
      ...(node.note ? [L.kv("note", node.note)] : []),
      ...(entry ? [L.kv("ref", entry.ref), L.kv("dated", entry.span)] : []),
    ]);
  },
};

const wc = {
  name: "wc",
  usage: "wc <file>",
  summary: "count lines and words",
  group: "read",
  run: (args, ctx) => {
    const found = need(ctx, "wc", args[0], { type: "file" });
    if (!found) return;
    const { node } = found;

    const text = node.lines.map(lineText).join("\n");
    ctx.print([
      L.kv("lines", String(node.lines.length)),
      L.kv("words", String(text.split(/\s+/).filter(Boolean).length)),
      L.kv("chars", String(text.length)),
    ]);
  },
};

const whoami = {
  name: "whoami",
  usage: "whoami",
  summary: "the short version",
  group: "me",
  run: (_args, ctx) =>
    ctx.print([
      L.head(profile.name),
      L.dim(`${profile.role} · ${profile.based}`),
    ]),
};

const neofetch = {
  name: "neofetch",
  aliases: ["fetch", "sysinfo"],
  usage: "neofetch",
  summary: "the whole picture, tabulated",
  group: "me",
  run: (_args, ctx) => {
    const counts = indexGroups
      .map(
        (group) =>
          `${
            siteIndex.filter((entry) => entry.group === group.id).length
          } ${group.label.toLowerCase()}`
      )
      .join(" · ");
    const palette = ctx.themes[ctx.themeId];

    ctx.print([
      L.head(profile.name.toLowerCase().replace(" ", "@")),
      L.rule(),
      L.kv("role", profile.role),
      L.kv("based", profile.based),
      L.kv("uptime", `${yearsShipping()} years, since ${profile.since}`),
      L.kv("shell", "index-sh 1.0 (read-only)"),
      L.kv("palette", `${palette.name} — ${palette.tagline}`),
      L.kv("catalogue", `${siteIndex.length} entries — ${counts}`),
      L.kv("speaks", profile.languages.join(" · ")),
      L.kv("email", profile.email),
      L.rule(),
      L.dim("`help` for the command list, `exit` to go back to the page."),
    ]);
  },
};

const uptime = {
  name: "uptime",
  usage: "uptime",
  summary: "how long this has been going on",
  group: "me",
  run: (_args, ctx) =>
    ctx.print([
      L.out(
        `up ${yearsShipping()} years · ${roleCount} roles · load average: reasonable`
      ),
    ]),
};

const mail = {
  name: "mail",
  aliases: ["email"],
  usage: "mail",
  summary: "copy my email to the clipboard",
  group: "me",
  run: (_args, ctx) => {
    if (!navigator.clipboard?.writeText) {
      ctx.print([L.kv("email", profile.email)]);
      return;
    }
    navigator.clipboard.writeText(profile.email).then(
      () => ctx.print([L.out(`copied ${profile.email}`)]),
      () => ctx.print([L.kv("email", profile.email)])
    );
  },
};

const theme = {
  name: "theme",
  usage: "theme [name]",
  summary: "repaint the site — amber, bone, citron",
  group: "shell",
  run: (args, ctx) => {
    const id = args[0];
    if (!id) {
      ctx.print([
        ...Object.values(ctx.themes).map((option) =>
          L.kv(
            option.id === ctx.themeId ? "* " + option.id : "  " + option.id,
            option.tagline
          )
        ),
      ]);
      return;
    }

    if (!ctx.themes[id]) {
      ctx.print([
        L.error(`theme: ${id}: unknown. one of ${Object.keys(ctx.themes).join(", ")}`),
      ]);
      return;
    }

    ctx.setTheme(id);
    ctx.print([L.out(`palette → ${ctx.themes[id].name}`)]);
  },
};

const history = {
  name: "history",
  usage: "history",
  summary: "what you have typed",
  group: "shell",
  run: (_args, ctx) =>
    ctx.print(
      ctx.history.length
        ? ctx.history.map((entry, i) =>
            L.kv(String(i + 1).padStart(3), entry)
          )
        : [L.dim("nothing yet")]
    ),
};

const echo = {
  name: "echo",
  usage: "echo <text>",
  summary: "say it back",
  group: "shell",
  run: (args, ctx) => ctx.print([L.out(args.join(" "))]),
};

const date = {
  name: "date",
  usage: "date",
  summary: "your clock, not mine",
  group: "shell",
  run: (_args, ctx) =>
    ctx.print([
      L.out(
        new Date().toLocaleString(undefined, {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      ),
    ]),
};

const clear = {
  name: "clear",
  aliases: ["cls"],
  usage: "clear",
  summary: "wipe the scrollback",
  group: "shell",
  run: (_args, ctx) => ctx.clear(),
};

const exit = {
  name: "exit",
  aliases: ["quit", "q", "logout"],
  usage: "exit",
  summary: "back to the page",
  group: "shell",
  run: (_args, ctx) => ctx.closeShell(),
};

const which = {
  name: "which",
  usage: "which <command>",
  summary: "is that a real command",
  group: "shell",
  run: (args, ctx) => {
    const name = args[0];
    if (!name) {
      ctx.print([L.error("which: needs a command name")]);
      return;
    }
    const command = lookup(name);
    ctx.print(
      command
        ? [L.out(`/usr/bin/${command.name}${command.name === name ? "" : `  (${name} → ${command.name})`}`)]
        : [L.dim(`${name} not found`)]
    );
  },
};

const man = {
  name: "man",
  usage: "man <command>",
  summary: "the long form of one command",
  group: "shell",
  run: (args, ctx) => {
    const command = lookup(args[0] ?? "");
    if (!command) {
      ctx.print([
        L.error(`man: no entry for ${args[0] || "(nothing)"} — try \`help\``),
      ]);
      return;
    }

    ctx.print([
      L.head(command.name.toUpperCase()),
      L.kv("usage", command.usage),
      L.kv("does", command.summary),
      ...(command.name === "open"
        ? [
            L.kv(
              "note",
              "a CV entry opens on the page with its row expanded; -w follows its outbound link instead"
            ),
          ]
        : []),
      ...(command.aliases?.length
        ? [L.kv("also", command.aliases.join(", "))]
        : []),
      ...(command.notes ?? []).map((note) => L.dim(note)),
    ]);
  },
};

const FORTUNES = [
  "The requirements were in the room the whole time.",
  "Every legacy schema is somebody's Tuesday afternoon.",
  "A cache that is always right is just a database.",
  "The hard part was never the algorithm.",
  "Shipping on-site means the feedback loop has a face.",
  "Most of the work is the parts nobody scoped.",
];

const fortune = {
  name: "fortune",
  usage: "fortune",
  summary: "one opinion, at random",
  group: "shell",
  run: (_args, ctx) =>
    ctx.print([L.out(FORTUNES[Math.floor(Math.random() * FORTUNES.length)])]),
};

const help = {
  name: "help",
  aliases: ["?", "commands"],
  usage: "help",
  summary: "this list",
  group: "shell",
  run: (_args, ctx) => {
    const groups = [
      ["navigate", "Moving around"],
      ["read", "Reading things"],
      ["me", "About me"],
      ["shell", "The shell itself"],
    ];

    ctx.print([
      ...groups.flatMap(([id, label]) => [
        L.head(label),
        ...COMMANDS.filter(
          (command) => command.group === id && !command.hidden
        ).map((command) => L.kvw(command.usage, command.summary)),
        L.blank(),
      ]),
      L.dim(
        "tab completes · ↑↓ history · ctrl-l clears · esc or `exit` leaves · there are a few undocumented ones"
      ),
    ]);
  },
};

/* ------------------------------------------------------------------
   the undocumented ones
   ------------------------------------------------------------------ */

const joke = (name, lines, extra = {}) => ({
  name,
  usage: name,
  summary: "—",
  group: "shell",
  hidden: true,
  ...extra,
  run: (_args, ctx) => ctx.print(lines.map((text) => L.dim(text))),
});

const HIDDEN = [
  joke("sudo", [
    "floyd is not in the sudoers file. This incident has been reported.",
  ]),
  joke("rm", [
    "rm: this filesystem is my CV. Deleting it would not go well for either of us.",
  ], { aliases: ["rmdir", "unlink"] }),
  joke("mv", ["mv: read-only filesystem. Nothing here moves."], {
    aliases: ["cp", "touch", "mkdir", "chmod"],
  }),
  joke("vim", [
    "No editor here. You are already looking at the text.",
    "(`cat <file>` is the whole reading experience.)",
  ], { aliases: ["nano", "emacs", "vi", "code"] }),
  joke("ping", ["floyd.benedikter: 1 packet transmitted, 1 received, 0% loss."]),
  {
    name: "hire",
    usage: "hire",
    summary: "—",
    group: "shell",
    hidden: true,
    run: (_args, ctx) => {
      ctx.print([
        L.head("Well, that is the idea."),
        L.blank(),
        L.kv("email", profile.email),
        L.link("cv", "resume.pdf", "/Benedikter_CV_Oct_26.pdf"),
        L.blank(),
        L.dim("`mail` puts the address on your clipboard."),
      ]);
    },
  },
  {
    name: "exit-code",
    usage: "exit-code",
    summary: "—",
    group: "shell",
    hidden: true,
    run: (_args, ctx) => ctx.print([L.out("0")]),
  },
];

/* ------------------------------------------------------------------
   registry
   ------------------------------------------------------------------ */

const COMMANDS = [
  // navigate
  ls,
  cd,
  pwd,
  tree,
  // read
  cat,
  open,
  grep,
  find,
  stat,
  wc,
  // me
  whoami,
  neofetch,
  uptime,
  mail,
  // shell
  help,
  man,
  which,
  theme,
  history,
  echo,
  date,
  fortune,
  clear,
  exit,
  ...HIDDEN,
];

const INDEX = COMMANDS.reduce((map, command) => {
  map[command.name] = command;
  (command.aliases ?? []).forEach((alias) => {
    map[alias] = command;
  });
  return map;
}, {});

const lookup = (name) => INDEX[name.toLowerCase()];

/** Every name a user could type, for tab completion and `help`. */
const commandNames = Object.keys(INDEX)
  .filter((name) => !INDEX[name].hidden)
  .sort();

/**
 * Split a line the way a shell would, honouring quotes so
 * `grep "machine learning"` is one argument.
 */
const tokenize = (line) =>
  (line.match(/"[^"]*"|'[^']*'|\S+/g) ?? []).map((token) =>
    token.replace(/^["']|["']$/g, "")
  );

/**
 * Run one input line. Unknown commands fall through to a path lookup, so
 * typing `proda` or `projects` on its own does the obvious thing rather than
 * scolding you.
 */
export const runLine = (line, ctx) => {
  const [name, ...args] = tokenize(line);
  if (!name) return;

  const command = lookup(name);
  if (command) {
    command.run(args, ctx);
    return;
  }

  const { node, segments } = resolveLoose(ctx.cwd, name);
  if (node) {
    if (node.type === "dir") {
      ctx.setCwd(segments);
    } else {
      ctx.print(node.lines);
    }
    return;
  }

  ctx.print([
    L.error(`${name}: command not found`),
    L.dim("`help` lists everything. `ls` shows what is here."),
  ]);
};

/* ------------------------------------------------------------------
   tab completion
   ------------------------------------------------------------------ */

/**
 * Returns `{ line, candidates }`. `line` is the completed input (unchanged if
 * there is nothing unambiguous to add); `candidates` is what to print when the
 * completion is ambiguous.
 */
export const complete = (line, cwd) => {
  const trailingSpace = /\s$/.test(line);
  const tokens = tokenize(line);
  const completingArg = tokens.length > 1 || trailingSpace;

  if (!completingArg) {
    const stem = tokens[0] ?? "";
    const matches = commandNames.filter((name) => name.startsWith(stem));
    if (!matches.length) return { line, candidates: [] };
    if (matches.length === 1) return { line: `${matches[0]} `, candidates: [] };
    return { line: line.replace(/\S*$/, sharedPrefix(matches)), candidates: matches };
  }

  const stem = trailingSpace ? "" : tokens[tokens.length - 1];
  const slash = stem.lastIndexOf("/");
  const dirPart = slash >= 0 ? stem.slice(0, slash + 1) : "";
  const filePart = slash >= 0 ? stem.slice(slash + 1) : stem;

  const { node } = resolvePath(cwd, dirPart || ".");
  if (!node || node.type !== "dir") return { line, candidates: [] };

  // `cd cv/w` should land on work/ without stopping to offer contact.txt.
  const dirsOnly = ["cd", "tree"].includes(tokens[0]);

  const matches = node.children
    .filter(
      (child) =>
        (!dirsOnly || child.type === "dir") &&
        child.name.toLowerCase().startsWith(filePart.toLowerCase())
    )
    .map((child) => `${child.name}${child.type === "dir" ? "/" : ""}`);

  if (!matches.length) return { line, candidates: [] };

  if (matches.length === 1) {
    const completed = `${dirPart}${matches[0]}`;
    return {
      line: `${line.slice(0, line.length - stem.length)}${completed}${
        matches[0].endsWith("/") ? "" : " "
      }`,
      candidates: [],
    };
  }

  const shared = sharedPrefix(matches);
  return {
    line: `${line.slice(0, line.length - stem.length)}${dirPart}${shared}`,
    candidates: matches,
  };
};

const sharedPrefix = (values) => {
  if (!values.length) return "";
  return values.reduce((prefix, value) => {
    let i = 0;
    while (i < prefix.length && i < value.length && prefix[i] === value[i]) i++;
    return prefix.slice(0, i);
  });
};

/** The greeting. Kept here so the terminal component owns no copy. */
export const banner = () => [
  L.head(`${profile.name} — ${profile.role}`),
  L.dim(`index-sh 1.0 · read-only · ${siteIndex.length} entries indexed`),
  L.blank(),
  L.kv("cat resume", "the whole CV"),
  L.kv("ls", "what is in here"),
  L.kv("neofetch", "the short version"),
  L.kv("help", "every command"),
  L.blank(),
];
