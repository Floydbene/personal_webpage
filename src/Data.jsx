import { postEntries } from "./content/posts";
import voronoi from "./assets/voronoi.gif";
import taskBalancerGif from "./assets/taskBalancerGif.gif";
import mechanism from "./assets/mechanism_ventures_logo.jpg";
import carts from "./assets/carts.jpg";
import proda from "./assets/proda_ltd_logo.jpg";
import northslope from "./assets/northslope_technologies_logo.jpeg";
import openaiDeployment from "./assets/openai_deployment_company_logo.png";
import spaceInvadersGif from "./assets/Space_Eaters_DEMO_trimmed.gif";
import spaceInvaders from "./assets/space_invaders.png";
import golang from "./assets/golang.png";
import cachingCover from "./assets/caching.png";

const PRINCETON_SEAL =
  "https://upload.wikimedia.org/wikipedia/commons/d/d0/Princeton_seal.svg";

/**
 * Skills as plain data. The resume renders it and the shell's `cv/skills/`
 * files read it, so there is exactly one list to keep current.
 */
export const skills = {
  languages: {
    label: "programming languages",
    proficient: ["SQL", "TypeScript", "Python", "GoLang", "C++"],
    intermediate: ["Java"],
  },
  frameworks: {
    label: "frameworks & tools",
    items: [
      "React (+TypeScript)",
      "Vite",
      "Zustand",
      "WebSockets",
      "Jest",
      "Flask",
      "SQLite",
      "Docker",
      "Auth0",
    ],
  },
  spoken: {
    label: "languages",
    items: ["English", "German", "Italian"],
  },
};

export const resumeData = [
  {
    id: 1,
    title: "education",
    subtitles: [
      {
        subtitle: "Princeton University",
        imgLink: "https://www.cs.princeton.edu/",
        imgUrl: PRINCETON_SEAL,
        title: "B.Sc. (Hons) in Computer Science",
        timeFrame: "Sep 2019 – Jun 2023",
        text: (
          <p className="subText">
            Coursework: Machine Learning, Blockchains, Algorithm Design, Server
            & Website Programming and Design, Multivariable Calculus, Linear
            Algebra, Convex Optimisation, Statistics, Computation Theory.
          </p>
        ),
      },
    ],
  },
  {
    id: 2,
    title: "work",
    subtitles: [
      {
        subtitle: "The OpenAI Deployment Company",
        imgUrl: openaiDeployment,
        title: "Forward Deployed Engineer — London, UK",
        timeFrame: "Sep 2026 – Present",
      },
      {
        subtitle: "Northslope Technologies",
        imgLink: "https://www.northslope.com/",
        imgUrl: northslope,
        title: "Forward Deployed Engineer — London, UK",
        timeFrame: "Nov 2025 – Sep 2026",
        text: (
          <ul>
            <li>
              <p className="bullet-text">
                Acquired by OpenAI in September 2026 to form OpenAI Deploy Co.
              </p>
            </li>
            <li>
              <p className="bullet-text">
                Deployed on-site to integrate cutting-edge technology solutions
                directly with client operations
              </p>
            </li>
            <li>
              <p className="bullet-text">
                Collaborated closely with customer teams to understand
                requirements and deliver tailored technical solutions
              </p>
            </li>
            <li>
              <p className="bullet-text">
                Bridged the gap between product development and customer success
                through hands-on implementation and support
              </p>
            </li>
          </ul>
        ),
      },
      {
        subtitle: "PRODA",
        imgLink: "https://www.proda.com/",
        imgUrl: proda,
        title: "Full-Stack Engineer — London, UK",
        timeFrame: "Jun 2024 – Nov 2025",
        text: (
          <ul>
            <li>
              <p className="bullet-text">
                Developed a React/TypeScript/Redux web app with 300+ active
                users, using a Python/PostgreSQL backend and an in-house ML
                pipeline that processes and normalises 100+ financial documents
                per week
              </p>
            </li>
            <li>
              <p className="bullet-text">
                Optimised SQL security protocols in a relational DB, cutting
                latency by up to 99% on tables with 1M+ entries
              </p>
            </li>
            <li>
              <p className="bullet-text">
                Achieved 100% test coverage across core functionality using
                Vitest/Pytest/Playwright, eliminating CI/CD pipeline issues
                since my overhauls
              </p>
            </li>
            <li>
              <p className="bullet-text">
                Led a 72-hour hackathon project on LLM-powered data validation
                that won first place and was officially adopted
              </p>
            </li>
          </ul>
        ),
      },
      {
        subtitle: "Mechanism Ventures",
        imgLink: "https://mechanism.com/",
        imgUrl: mechanism,
        title: "Startup Generalist — Miami, FL",
        timeFrame: "Oct 2023 – Feb 2024",
        text: (
          <ul>
            <li>
              <p className="bullet-text">
                Shaped marketing, advertising, and sales strategies for a
                nutritional-supplement subsidiary through A/B tests, lifting
                session length and funnel completion by 30%
              </p>
            </li>
            <li>
              <p className="bullet-text">
                Successfully launched a subscription-based POC in 5
                weeks—validated by initial customer purchases and proof of
                revenue viability
              </p>
            </li>
            <li>
              <p className="bullet-text">
                Delivered impactful product features and interactive web
                interfaces using React.js, directly improving user engagement
                and conversion for startups with $20M+ annual run rates
              </p>
            </li>
            <li>
              <p className="bullet-text">
                Designed a pipeline to generate creative assets and branding
                elements using OpenAI and MidJourney APIs in real time, allowing
                users to engineer prompts via survey inputs
              </p>
            </li>
          </ul>
        ),
      },
      {
        subtitle: "CARTS",
        title: "Full-Stack Developer — Princeton, NJ ",
        timeFrame: "Apr 2022 – Sep 2022",
        imgLink: "https://www.cartsmobility.com/",
        imgUrl: carts,
        text: (
          <ul>
            <li>
              <p className="bullet-text">
                As part of the Trenton MOVES initiative, simulated millions of
                person trips across the United States and designed a network to
                accommodate as many passenger travels with self-driving cars as
                possible
              </p>
            </li>
            <li>
              <p className="bullet-text">
                Tackled problems including kiosk placement, ride-sharing
                heuristics, and empty vehicle repositioning heuristics
              </p>
            </li>
            <li>
              <p className="bullet-text">
                Developed a web app to visually simulate a public transportation
                network of autonomous vehicles using Python, Flask, JavaScript,
                and CSS
              </p>
            </li>
            <li>
              <p className="bullet-text">
                Analyzed autonomous vehicle crash data using Python and Pandas;
                estimated and visualized potential profit curves for autonomous
                vehicle service providers
              </p>
            </li>
          </ul>
        ),
      },
    ],
  },
  {
    id: 3,
    title: "hard skills",
    subtitles: [
      {
        subtitle: skills.languages.label,
        text: (
          <p className="subText">
            {skills.languages.proficient.join(", ")} (proficient);{" "}
            {skills.languages.intermediate.join(", ")} (intermediate).
          </p>
        ),
      },
      {
        subtitle: skills.frameworks.label,
        text: <p className="subText">{skills.frameworks.items.join(", ")}.</p>,
      },
      {
        subtitle: skills.spoken.label,
        text: <p className="subText">{skills.spoken.items.join(", ")}.</p>,
      },
    ],
  },
  {
    id: 4,
    title: "projects",
    subtitles: [
      {
        subtitle: "TigerMealX",
        title: "Full-stack platform for 3,000+ students",
        text: (
          <p className="subText">
            Developed and deployed a Python/Flask + React app serving 3,000+
            students, integrating Auth0/Duo, university scanning applications,
            and legacy schema migrations; designed an adaptive data model for a
            seamless transition; and implemented robust authentication aligned
            with Princeton’s authorisation framework.
          </p>
        ),
      },
      {
        subtitle: "GC Load Balancer",
        title: "Go + React load-balancing system with GC-aware routing",
        imgLink: "https://github.com/Floydbene/GC-Load-Balancer",
        imgUrl: golang,
        text: (
          <p className="subText">
            Distributed task processor with a Go backend (round-robin +
            memory-aware server selection and simulated GC), rate-limited REST
            API, and a React dashboard for live metrics; one-command Makefile to
            run frontend/backend locally.
          </p>
        ),
      },
      {
        subtitle: "Space Invaders",
        title: "Retro arcade clone",
        imgLink: "https://github.com/Floydbene/space-invaders",
        imgUrl: spaceInvaders,
        text: (
          <p className="subText">
            From-scratch remake featuring a tight game loop, keyboard controls,
            sprite rendering, collision detection, progressive enemy waves, and
            score/lives tracking.
          </p>
        ),
      },
    ],
  },
];

/**
 * One flat index for the landing page. Work, builds and writing all share a
 * single row shape so the whole page can be one catalogue rather than three
 * differently-shaped sections.
 *
 * `ref` is the catalogue number and is stable — it is what `open 04` refers to
 * in the command bar, so do not renumber casually.
 */
const portfolioEntries = [
  {
    ref: "00",
    group: "work",
    name: "The OpenAI Deployment Company",
    role: "Forward Deployed Engineer",
    place: "London",
    span: "Sep 2026 – Present",
    year: 2026,
    current: true,
    logo: openaiDeployment,
    body: "Forward Deployed Engineer in London, since September 2026. Northslope was acquired by OpenAI in September 2026 to form OpenAI Deploy Co.",
    tags: [],
    links: [],
  },
  {
    ref: "01",
    group: "work",
    name: "Northslope Technologies",
    role: "Forward Deployed Engineer",
    place: "London",
    span: "Nov 2025 – Sep 2026",
    year: 2025,
    logo: northslope,
    body: "Deployed on-site with customer teams, turning half-specified operational problems into software that ships the same week. Most of the job is being in the room. Acquired by OpenAI in September 2026 to form OpenAI Deploy Co.",
    tags: ["Foundry", "PySpark", "TypeScript", "On-site"],
    links: [{ label: "northslope.com", href: "https://www.northslope.com/" }],
  },
  {
    ref: "02",
    group: "work",
    name: "PRODA",
    role: "Full-Stack Engineer",
    place: "London",
    span: "Jun 2024 – Nov 2025",
    year: 2024,
    logo: proda,
    body: "Built a React/TypeScript app for 300+ users on a Python and PostgreSQL backend, feeding an in-house ML pipeline that normalises 100+ financial documents a week. Cut query latency up to 99% on million-row tables, and took core coverage to 100% — the CI pipeline has not flaked since. Won a 72-hour hackathon with LLM-powered data validation that shipped to production.",
    tags: ["React", "TypeScript", "Python", "PostgreSQL", "Playwright"],
    links: [{ label: "proda.com", href: "https://www.proda.com/" }],
  },
  {
    ref: "03",
    group: "work",
    name: "Mechanism Ventures",
    role: "Startup Generalist",
    place: "Miami",
    span: "Oct 2023 – Feb 2024",
    year: 2023,
    logo: mechanism,
    body: "Launched a subscription proof-of-concept in five weeks and proved revenue with real purchases. A/B tests on the funnel lifted session length and completion 30%. Also wired OpenAI and MidJourney into a real-time branding-asset pipeline driven by survey answers.",
    tags: ["React", "Growth", "A/B testing", "OpenAI API"],
    links: [{ label: "mechanism.com", href: "https://mechanism.com/" }],
  },
  {
    ref: "04",
    group: "work",
    name: "CARTS",
    role: "Full-Stack Developer",
    place: "Princeton",
    span: "Apr 2022 – Sep 2022",
    year: 2022,
    logo: carts,
    body: "Part of the Trenton MOVES initiative. Simulated millions of person-trips to design an autonomous-vehicle transit network — kiosk placement, ride-share matching, empty-vehicle repositioning — then built the Flask and JavaScript app that let people watch it run.",
    tags: ["Python", "Flask", "Pandas", "Simulation"],
    links: [
      { label: "cartsmobility.com", href: "https://www.cartsmobility.com/" },
    ],
  },
  {
    ref: "05",
    group: "work",
    // Sits in the work column on the page, but files under cv/education in the
    // shell — a degree is not a deployment.
    track: "education",
    name: "Princeton University",
    role: "B.Sc. (Hons) Computer Science",
    place: "New Jersey",
    span: "Sep 2019 – Jun 2023",
    year: 2019,
    logo: PRINCETON_SEAL,
    body: "Machine learning, blockchains, algorithm design, convex optimisation, computation theory. Server and website programming, back when that still meant writing the server.",
    tags: ["Machine Learning", "Algorithms", "Convex Optimisation"],
    links: [
      { label: "cs.princeton.edu", href: "https://www.cs.princeton.edu/" },
    ],
  },

  {
    ref: "06",
    group: "build",
    name: "TRINI",
    role: "Adaptive load balancer",
    place: "Go",
    span: "2025",
    year: 2025,
    image: taskBalancerGif,
    imageAspect: "3398 / 1840",
    imageAlt: "TRINI dashboard showing task load across concurrent servers",
    body: "A Go load-balancer that distributes tasks across concurrent nodes with coordinated GC locking and asynchronous responses. Round-robin plus memory-aware server selection, a rate-limited REST API, and a React/WebSocket dashboard so you can watch the queue breathe.",
    tags: ["GoLang", "React", "Zustand", "WebSockets"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Floydbene/GC-Load-Balancer",
      },
    ],
  },
  {
    ref: "07",
    group: "build",
    name: "Space Eaters",
    role: "Arcade game",
    place: "C++",
    span: "2024",
    year: 2024,
    image: spaceInvadersGif,
    imageAspect: "1596 / 1240",
    imageAlt: "Space Eaters gameplay with enemy waves and player controls",
    body: "Space Invaders rebuilt from scratch in C++ and SFML. Tight game loop, sprite rendering, collision detection, progressive waves. Small, fast, and playable in the browser demo.",
    tags: ["C++", "SFML"],
    links: [
      { label: "GitHub", href: "https://github.com/Floydbene/space-invaders" },
    ],
  },
  {
    ref: "08",
    group: "build",
    name: "Lloyd Relaxation",
    role: "Voronoi stippling",
    place: "JavaScript",
    span: "2023",
    year: 2023,
    image: voronoi,
    imageAspect: "1508 / 784",
    imageAlt: "Animated Voronoi cells settling through Lloyd relaxation",
    body: "An interactive toy for Lloyd's relaxation over Voronoi diagrams and Delaunay triangulation. Drag points around and watch computational geometry settle into something that looks hand-stippled.",
    tags: ["JavaScript", "Canvas", "Geometry"],
    links: [
      { label: "Live", href: "https://floyds-lloyd.netlify.app/" },
      {
        label: "GitHub",
        href: "https://github.com/Floydbene/Voronoi-Lloyd-relaxation",
      },
    ],
  },
  {
    ref: "09",
    group: "build",
    name: "TigerMealX",
    role: "Campus dining platform",
    place: "Flask",
    span: "2023",
    year: 2023,
    body: "A Flask and React platform serving 3,000+ Princeton students. Integrated Auth0/Duo against the university's authorisation framework, hooked into campus scanning hardware, and migrated a legacy schema behind an adaptive data model so nobody noticed the switch.",
    tags: ["Python", "Flask", "React", "Auth0"],
    links: [],
  },

  {
    ref: "10",
    group: "write",
    name: "ML-Based Caching",
    role: "Research",
    place: "Paper",
    span: "2023",
    year: 2023,
    image: cachingCover,
    imageAspect: "2096 / 1086",
    imageAlt: "Research cover for machine-learning based cache eviction",
    body: "On whether learned cache-eviction policies actually beat LRU once you account for the cost of inference. Short answer: sometimes, and the conditions matter more than the model.",
    tags: ["Caching", "Machine Learning", "Algorithms"],
    links: [{ label: "Read", href: "/research/caching", internal: true }],
  },
];

export const indexGroups = [
  { id: "work", label: "Experience", note: "Where I have been deployed" },
  { id: "build", label: "Projects", note: "Things made for their own sake" },
  { id: "write", label: "Research", note: "Longer thinking" },
  { id: "posts", label: "Posts", note: "Notes from the workbench" },
];

/**
 * Posts — teaching notes, filed by subject rather than by date.
 *
 * Same catalogue idiom as `siteIndex`: a stable `ref` per section, rows that
 * read as a numbered list. `slug` is the URL (`/posts/:slug`) and the shell
 * filename, so it is as stable as the ref.
 *
 * `body` is blocks rather than markup because two things render it: the post
 * page, and `cat` in the shell. One source, two presentations.
 */
export const postSections = [
  {
    id: "machine-learning",
    label: "Machine Learning",
    note: "From raw table to trainable set",
  },
];

export const posts = postEntries;

export const siteIndex = [
  ...portfolioEntries,
  ...posts.map((post) => ({
    ref: String(
      Math.max(...portfolioEntries.map((entry) => Number(entry.ref))) +
        Number(post.ref),
    ).padStart(2, "0"),
    group: "posts",
    name: post.title,
    role: post.status === "draft" ? "In progress" : post.level,
    place: postSections.find((section) => section.id === post.section)?.label,
    span: post.span,
    year: Number(post.span),
    body: post.summary,
    tags: post.tags,
    links: [
      { label: "View post", href: `/posts/${post.slug}`, internal: true },
    ],
  })),
];

/** Masthead figures. Derived where possible so they cannot drift from the index. */
const roles = siteIndex.filter(
  (entry) => entry.group === "work" && entry.track !== "education",
);

export const profile = {
  name: "Floyd Benedikter",
  role: "Forward Deployed Software Engineer",
  // Both derived from the index, so neither can contradict the rows above.
  based: roles.find((entry) => entry.current)?.place ?? roles[0].place,
  employer: roles.find((entry) => entry.current)?.name ?? roles[0].name,
  since: Math.min(...roles.map((entry) => entry.year)),
  languages: skills.spoken.items,
  email: "floyd.benedikter@gmail.com",
  github: "https://www.github.com/floydbene",
  linkedin: "https://www.linkedin.com/in/floydbenedikter",
  /**
   * The masthead lede as segments rather than markup, because two things read
   * it: Masthead renders `em` as <strong>, and the shell's about.txt joins the
   * `t` values into plain text. One source, two presentations.
   */
  lede: [
    {
      t: "I’m a Forward Deployed Engineer with a background in scaling startups and full-stack engineering. I’m especially interested in web development, machine learning, and system design.",
    },
  ],
};
