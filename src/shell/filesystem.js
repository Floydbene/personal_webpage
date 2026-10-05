/**
 * A read-only virtual filesystem over the CV and the project index.
 *
 * Every node here is *derived* from src/Data.jsx — nothing is transcribed by
 * hand. Add a row to `siteIndex` and it shows up under the right directory
 * with a slug, contents and an `open` target for free.
 *
 * Node shapes:
 *   dir  { name, type: "dir",  children, route?, note? }
 *   file { name, type: "file", lines, note?, entry?, href?, external? }
 *
 * `lines` is the rendered form: an array of tagged records the terminal knows
 * how to paint. `entry` is a catalogue ref, which is what lets `open` hand a
 * file back to the page. `href` makes a file openable in a new tab.
 */

import {
  siteIndex,
  indexGroups,
  profile,
  skills,
  posts,
  postSections,
} from "../Data";
import { asideTypes } from "../content/postAsides";

/* ------------------------------------------------------------------
   line constructors
   ------------------------------------------------------------------ */

export const L = {
  out: (text) => ({ kind: "out", text }),
  dim: (text) => ({ kind: "dim", text }),
  head: (text) => ({ kind: "head", text }),
  error: (text) => ({ kind: "error", text }),
  blank: () => ({ kind: "blank", text: "" }),
  rule: () => ({ kind: "rule", text: "" }),
  kv: (key, text) => ({ kind: "kv", key, text }),
  /** Same two columns, wider first one — for usage strings and paths. */
  kvw: (key, text) => ({ kind: "kv", key, text, wide: true }),
  /** Same two columns, value carries the emphasis — resume headlines. */
  kvs: (key, text) => ({ kind: "kv", key, text, strong: true }),
  link: (key, text, href, internal) => ({
    kind: "link",
    key,
    text,
    href,
    internal,
  }),
  echo: (text) => ({ kind: "echo", text }),
  listing: (items) => ({ kind: "listing", text: "", items }),
  /** Tree rows keep the spine and the name separate so only the name colours. */
  branch: (prefix, name, type) => ({
    kind: "branch",
    prefix,
    text: name,
    nodeType: type,
  }),
};

/* ------------------------------------------------------------------
   helpers
   ------------------------------------------------------------------ */

const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const dir = (name, children, extra = {}) => ({
  name,
  type: "dir",
  children,
  ...extra,
});

const file = (name, lines, extra = {}) => ({
  name,
  type: "file",
  lines,
  ...extra,
});

/** Searchable / measurable text for a line, whatever its kind. */
export const lineText = (line) =>
  line.kind === "listing"
    ? line.items.map((item) => item.name).join("  ")
    : [line.key, line.text, line.href].filter(Boolean).join(" ").trim();

export const nodeSize = (node) =>
  node.type === "dir"
    ? node.children.length
    : node.lines.reduce((total, line) => total + lineText(line).length + 1, 0);

export const formatSize = (bytes) =>
  bytes < 1024 ? `${bytes}b` : `${(bytes / 1024).toFixed(1)}k`;

/* ------------------------------------------------------------------
   file bodies
   ------------------------------------------------------------------ */

const entryFile = (entry) =>
  file(
    `${slug(entry.name)}.md`,
    [
      L.head(`${entry.name} — ${entry.role}`),
      L.dim(`${entry.place} · ${entry.span}${entry.current ? " · current" : ""}`),
      L.blank(),
      L.out(entry.body),
      L.blank(),
      L.kv("stack", entry.tags.join(" · ")),
      ...entry.links.map((link) =>
        L.link("link", link.label, link.href, link.internal)
      ),
      ...(entry.links.length
        ? []
        : [L.kv("link", "none public — ask me about it")]),
    ],
    { entry: entry.ref, note: entry.role }
  );

/** Post blocks are already structured, so `cat` just repaints them as lines. */
const inlineText = (text) => Array.isArray(text)
  ? text.map((part) => typeof part === "string" ? part : part.kind === "link" ? `${part.text} (${part.href})` : part.text).join("")
  : text;

const postBlock = (block) => {
  switch (block.kind) {
    case "h":
      return [L.blank(), L.head(block.text)];
    case "list":
      return block.items.map((item) => L.out(`  · ${item}`));
    case "code":
      return block.text.split("\n").map((line) => L.dim(`  ${line}`));
    case "note":
      {
        const category = asideTypes[block.type] || asideTypes.note;
        return [L.dim(`${category.animal} · ${category.label}${block.title ? ` — ${block.title}` : ""}`), L.out(`| ${inlineText(block.text)}`)];
      }
    case "figure":
      return [L.dim(inlineText(block.caption)), L.link("Figure", block.alt, block.src, false)];
    case "table":
      return [block.headers, ...block.rows].map((row) => L.out(row.map(inlineText).join(" | ")));
    default:
      return [L.out(inlineText(block.text))];
  }
};

const postFile = (post) =>
  file(
    `${post.slug}.md`,
    [
      L.head(post.title),
      L.dim(`${post.level} · ${post.status === "draft" ? "in progress" : `${post.minutes} min`} · ${post.span}`),
      L.blank(),
      L.out(post.summary),
      ...(post.status === "draft"
        ? [L.blank(), L.out("This post is still being written. Try `open projects` to explore the work behind the notes.")]
        : post.body.flatMap((block) => [...postBlock(block), L.blank()])),
      L.kv("tags", post.tags.join(" · ")),
    ],
    {
      note: post.status === "draft" ? "in progress" : `${post.minutes} min read`,
      // Plain internal href, so `open` routes to the post rather than the index.
      href: `/posts/${post.slug}`,
    }
  );

const byGroup = (group) => siteIndex.filter((entry) => entry.group === group);
const workEntries = byGroup("work").filter(
  (entry) => entry.track !== "education"
);
const educationEntries = siteIndex.filter(
  (entry) => entry.track === "education"
);

const aboutFile = file(
  "about.txt",
  [
    L.head(profile.name),
    L.dim(profile.role),
    L.blank(),
    L.out(profile.lede.map((segment) => segment.t).join("")),
    L.blank(),
    L.kv("based", profile.based),
    L.kv("speaks", profile.languages.join(" · ")),
    L.kv("since", String(profile.since)),
  ],
  { note: "who is this" }
);

const contactFile = file(
  "contact.txt",
  [
    L.head("Reach me"),
    L.blank(),
    L.kv("email", profile.email),
    L.link("github", "floydbene", profile.github),
    L.link("linkedin", "floydbenedikter", profile.linkedin),
    L.blank(),
    L.dim("`mail` copies the address to your clipboard."),
  ],
  { note: "email, github, linkedin" }
);

const skillsFiles = [
  file(
    "languages.txt",
    [
      L.head("Programming languages"),
      L.blank(),
      L.kv("fluent", skills.languages.proficient.join(" · ")),
      L.kv("passable", skills.languages.intermediate.join(" · ")),
    ],
    { note: skills.languages.proficient.length + " proficient" }
  ),
  file(
    "frameworks.txt",
    [
      L.head("Frameworks & tools"),
      L.blank(),
      ...skills.frameworks.items.map((item) => L.out(`  ${item}`)),
    ],
    { note: `${skills.frameworks.items.length} entries` }
  ),
  file(
    "spoken.txt",
    [
      L.head("Spoken languages"),
      L.blank(),
      ...skills.spoken.items.map((item) => L.out(`  ${item}`)),
    ],
    { note: skills.spoken.items.join(", ") }
  ),
];

/**
 * The whole CV as text.
 *
 * `cat resume` renders this; `open resume` still fetches the real PDF. The
 * span sits in the key column so the whole document is one aligned rail, which
 * is the only reason a resume works in a terminal at all.
 */
const resumeSection = (title) => [
  L.blank(),
  L.head(title.toUpperCase()),
  L.rule(),
];

const resumeRole = (entry) => [
  L.kvs(entry.span, `${entry.name} — ${entry.role} · ${entry.place}`),
  L.kv("", entry.body),
  ...(entry.tags.length ? [L.kv("", entry.tags.join(" · "))] : []),
  L.blank(),
];

// Projects get a headline and a stack, not a paragraph — `cat projects/trini`
// is where the detail lives.
const resumeProject = (entry) => [
  L.kvs(entry.span, `${entry.name} — ${entry.role}`),
  L.kv("", entry.tags.join(" · ")),
];

const resumeLines = () => [
  L.head(profile.name),
  L.dim(profile.role),
  L.kv("email", profile.email),
  L.link("github", profile.github.replace(/^https?:\/\/(www\.)?/, ""), profile.github),
  L.link("linkedin", profile.linkedin.replace(/^https?:\/\/(www\.)?/, ""), profile.linkedin),
  L.blank(),
  L.dim("Rendered for the terminal. `open resume` fetches the real PDF."),

  ...resumeSection("Experience"),
  ...workEntries.flatMap(resumeRole),

  ...resumeSection("Education"),
  ...educationEntries.flatMap(resumeRole),

  ...resumeSection("Skills"),
  L.kv("languages", skills.languages.proficient.join(" · ")),
  L.kv("", `${skills.languages.intermediate.join(" · ")} (intermediate)`),
  L.kv("tools", skills.frameworks.items.join(" · ")),
  L.kv("spoken", skills.spoken.items.join(" · ")),

  ...resumeSection("Selected projects"),
  ...byGroup("build").flatMap(resumeProject),

  ...resumeSection("Writing"),
  ...byGroup("write").flatMap(resumeProject),
];

const readmeFile = file(
  "README.md",
  [
    L.head("floyd@benedikter:~"),
    L.blank(),
    L.out(
      "You are in a shell over my CV. Everything on the site is a file here, so you can read it however you prefer to read things."
    ),
    L.blank(),
    L.kv("cat resume", "the whole CV, right here"),
    L.kv("ls", "see what is in here"),
    L.kv("cd cv/work", "walk into a directory"),
    L.kv("cat proda", "read an entry — refs and partial names both work"),
    L.kv("open trini", "hand a file back to the page, or out to the web"),
    L.kv("grep python", "search everything at once"),
    L.kv("help", "the full list"),
    L.blank(),
    L.dim("Nothing here writes. `rm` is a joke and so is `sudo`."),
  ],
  { note: "start here" }
);

/* ------------------------------------------------------------------
   the tree
   ------------------------------------------------------------------ */

const groupNote = (id) =>
  indexGroups.find((group) => group.id === id)?.note ?? "";

export const root = dir("/", [
  readmeFile,
  aboutFile,
  contactFile,
  file(
    "resume.pdf",
    resumeLines(),
    {
      note: "the whole CV — cat it, or open the real file",
      href: "/Benedikter_CV_Oct_26.pdf",
      external: true,
    }
  ),
  dir(
    "cv",
    [
      dir("work", workEntries.map(entryFile), {
        note: groupNote("work"),
        route: "/?section=work",
      }),
      dir("education", educationEntries.map(entryFile), {
        note: "Where I was taught",
        route: "/?section=work",
      }),
      dir("skills", skillsFiles, { note: "What I reach for" }),
    ],
    { note: "the long-form CV", route: "/resume" }
  ),
  dir("projects", byGroup("build").map(entryFile), {
    note: groupNote("build"),
    route: "/?section=build",
  }),
  dir("writing", byGroup("write").map(entryFile), {
    note: groupNote("write"),
    route: "/?section=write",
  }),
  dir(
    "posts",
    postSections.map((section) =>
      dir(
        slug(section.label),
        posts
          .filter((post) => post.section === section.id)
          .map(postFile),
        { note: section.note, route: "/posts" }
      )
    ),
    { note: "teaching notes, by subject", route: "/posts" }
  ),
]);

/* ------------------------------------------------------------------
   path resolution
   ------------------------------------------------------------------ */

const EXTENSIONS = [".md", ".txt", ".pdf"];

/**
 * Forgiving child lookup. Exact name first, then the same name with an
 * extension, then the catalogue ref, then a unique case-insensitive prefix or
 * substring. So `cat 02`, `cat proda` and `cat proda.md` all land on the same
 * file, but an ambiguous stem still fails rather than guessing.
 */
const findChild = (node, rawName) => {
  if (!node || node.type !== "dir") return undefined;
  const name = rawName.toLowerCase();
  const { children } = node;

  const exact = children.find((child) => child.name.toLowerCase() === name);
  if (exact) return exact;

  const withExtension = children.find((child) =>
    EXTENSIONS.some((extension) => child.name.toLowerCase() === name + extension)
  );
  if (withExtension) return withExtension;

  const byRef = children.find(
    (child) => child.entry && child.entry === name.padStart(2, "0")
  );
  if (byRef) return byRef;

  const matches = children.filter((child) =>
    child.name.toLowerCase().startsWith(name)
  );
  if (matches.length === 1) return matches[0];

  const loose = children.filter((child) =>
    child.name.toLowerCase().includes(name)
  );
  return loose.length === 1 ? loose[0] : undefined;
};

/**
 * Resolve a path string against a cwd. Returns `{ segments, node }` on a hit,
 * or `{ segments, node: undefined, failedAt }` so callers can say *which*
 * component was wrong instead of just "no such file".
 */
export const resolvePath = (cwd, input) => {
  const raw = (input ?? "").trim();
  const absolute = raw.startsWith("/") || raw.startsWith("~");
  let segments = absolute ? [] : [...cwd];

  const parts = raw
    .replace(/^~/, "")
    .split("/")
    .filter((part) => part.length > 0 && part !== ".");

  for (const part of parts) {
    if (part === "..") {
      segments = segments.slice(0, -1);
      continue;
    }

    const parent = nodeAt(segments);
    const child = findChild(parent, part);
    if (!child) return { segments, node: undefined, failedAt: part };
    segments = [...segments, child.name];
  }

  return { segments, node: nodeAt(segments) };
};

const nodeAt = (segments) =>
  segments.reduce(
    (node, segment) =>
      node && node.type === "dir"
        ? node.children.find((child) => child.name === segment)
        : undefined,
    root
  );

export const displayPath = (segments) =>
  segments.length ? `~/${segments.join("/")}` : "~";

/** Depth-first walk yielding `{ segments, path, node }` for every file. */
export const walkFiles = (node = root, segments = []) =>
  node.type === "file"
    ? [{ segments, path: displayPath(segments), node }]
    : node.children.flatMap((child) =>
        walkFiles(child, [...segments, child.name])
      );

/** All descendants, dirs included — used by `find` and the loose resolver. */
export const walkAll = (node = root, segments = []) => [
  ...(segments.length
    ? [{ segments, path: displayPath(segments), node }]
    : []),
  ...(node.type === "dir"
    ? node.children.flatMap((child) => walkAll(child, [...segments, child.name]))
    : []),
];

/**
 * Resolve like `resolvePath`, but if a bare name misses in the current
 * directory, look for it anywhere in the tree.
 *
 * This is the difference between a shell that is fun and one that is a chore:
 * `cat proda` and `open trini` should work from wherever you happen to be
 * standing, because nobody visiting a portfolio wants to `cd` first. Paths
 * containing a slash stay strict, and an ambiguous stem still refuses to guess.
 */
export const resolveLoose = (cwd, input) => {
  const raw = (input ?? "").trim();
  const strict = resolvePath(cwd, raw);

  if (strict.node || !raw || raw.includes("/") || raw.startsWith("~")) {
    return strict;
  }

  const needle = raw.toLowerCase();
  const rank = ({ node }) => {
    const name = node.name.toLowerCase();
    if (name === needle) return 0;
    if (EXTENSIONS.some((extension) => name === needle + extension)) return 1;
    if (node.entry && node.entry === needle.padStart(2, "0")) return 1;
    if (name.startsWith(needle)) return 2;
    if (name.includes(needle)) return 3;
    return Infinity;
  };

  const ranked = walkAll()
    .map((hit) => ({ ...hit, rank: rank(hit) }))
    .filter((hit) => Number.isFinite(hit.rank))
    .sort((a, b) => a.rank - b.rank);

  if (!ranked.length) return strict;

  const best = ranked.filter((hit) => hit.rank === ranked[0].rank);
  if (best.length > 1) {
    return { ...strict, ambiguous: best.map((hit) => hit.path) };
  }

  return { segments: best[0].segments, node: best[0].node };
};
