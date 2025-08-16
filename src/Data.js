import voronoi from "./assets/voronoi.gif";
import taskBalancerGif from "./assets/taskBalancerGif.gif";
import mechanism from "./assets/mechanism_ventures_logo.jpg";
import carts from "./assets/carts.jpg";
import proda from "./assets/proda_ltd_logo.jpg";
import spaceInvadersGif from "./assets/Space_Eaters_DEMO_trimmed.gif";
import spaceInvaders from "./assets/space_invaders.png";
import golang from "./assets/golang.png";

export const resumeData = [
  {
    id: 1,
    title: "education",
    subtitles: [
      {
        subtitle: "Princeton University",
        imgLink: "https://www.cs.princeton.edu/",
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/commons/d/d0/Princeton_seal.svg",
        title: "B.Sc. (Hons) in Computer Science (2019–2023)",
        text: "Coursework: Machine Learning, Blockchains, Algorithm Design, Server & Website Programming and Design, Multivariable Calculus, Linear Algebra, Convex Optimisation, Statistics, Computation Theory.",
      },
    ],
  },
  {
    id: 2,
    title: "work",
    subtitles: [
      {
        subtitle: "PRODA",
        imgLink: "https://www.proda.com/",
        imgUrl: proda,
        title: "Full-Stack Engineer — London, UK",
        text: "Developed a React/TypeScript/Redux web app with 300+ active users, using a Python/PostgreSQL backend and an in-house ML pipeline that processes and normalises 100+ financial documents per week; optimised SQL security protocols in a relational DB, cutting latency by up to 99% on tables with 1M+ entries; achieved 100% test coverage across core functionality using Vitest/Pytest/Playwright, eliminating CI/CD pipeline issues since my overhauls; led a 72-hour hackathon project on LLM-powered data validation that won first place and was officially adopted.",
      },
      {
        subtitle: "Mechanism Ventures",
        imgLink: "https://mechanism.com/",
        imgUrl: mechanism,
        title: "Startup Generalist — Miami, FL (Oct. 2023 - Jan. 2024)",
        text: "Shaped marketing, advertising, and sales strategies for a nutritional-supplement subsidiary through A/B tests, lifting session length and funnel completion by 30%; successfully launched a subscription-based POC in 5 weeks—validated by initial customer purchases and proof of revenue viability; delivered impactful product features and interactive web interfaces using React.js, directly improving user engagement and conversion for startups with $20M+ annual run rates; designed a pipeline to generate creative assets and branding elements using OpenAI and MidJourney APIs in real time, allowing users to engineer prompts via survey inputs.",
      },
      {
        subtitle: "CARTS",
        title: "Full-Stack Developer — Princeton, NJ",
        imgLink: "https://www.cartsmobility.com/",
        imgUrl: carts,
        text: "As part of the Trenton MOVES initiative, simulated millions of person trips across the United States and designed a network to accommodate as many passenger travels with self-driving cars as possible. Tackled problems including kiosk placement, ride-sharing heuristics, and empty vehicle repositioning heuristics. Developed a web app to visually simulate a public transportation network of autonomous vehicles using Python, Flask, JavaScript, and CSS; analyzed autonomous vehicle crash data using Python and Pandas; estimated and visualized potential profit curves for autonomous vehicle service providers.",
      },
    ],
  },
  {
    id: 3,
    title: "hard skills",
    subtitles: [
      {
        subtitle: "programming languages",
        text: "SQL, TypeScript, Python, GoLang, C++ (proficient); Java (intermediate).",
      },
      {
        subtitle: "frameworks & tools",
        text: "React (+TypeScript), Vite, Zustand, WebSockets, GitHub Actions, Jest, Flask, SQLite, Docker, Auth0, Duo, Airtable, Asana, Google Sheets, Dall-E, MidJourney.",
      },
      {
        subtitle: "languages",
        text: "English, German, Italian (professional proficiency).",
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
        text: "Developed and deployed a Python/Flask + React app serving 3,000+ students, integrating Auth0/Duo, university scanning applications, and legacy schema migrations; designed an adaptive data model for a seamless transition; and implemented robust authentication aligned with Princeton’s authorisation framework.",
      },
      {
        subtitle: "GC Load Balancer",
        title: "Go + React load-balancing system with GC-aware routing",
        imgLink: "https://github.com/Floydbene/GC-Load-Balancer",
        imgUrl: golang,
        text: "Distributed task processor with a Go backend (round-robin + memory-aware server selection and simulated GC), rate-limited REST API, and a React dashboard for live metrics; one-command Makefile to run frontend/backend locally.",
      },
      {
        subtitle: "Space Invaders",
        title: "Retro arcade clone",
        imgLink: "https://github.com/Floydbene/space-invaders",
        imgUrl: spaceInvaders,
        text: "From-scratch remake featuring a tight game loop, keyboard controls, sprite rendering, collision detection, progressive enemy waves, and score/lives tracking.",
      },
    ],
  },
];

export const portfolio = [
  {
    id: 5,
    title: "TRINI: adaptive load balancing strategy in GoLang",
    img: taskBalancerGif,
    git: "https://github.com/Floydbene/GC-Load-Balancer",
    information:
      "High-performance Golang load-balancer simulation that dynamically distributes tasks across concurrent nodes with coordinated GC locking, asynchronous responses, and a React/WebSocket dashboard for live visuals.",
    tags: ["GoLang", "React", "Zustand", "Load Balancer"],
  },
  {
    id: 6,
    title: "Space Eaters: An classic arcade game written in C++",
    img: spaceInvadersGif,
    git: "https://github.com/Floydbene/space-invaders",
    information:
      "Lightweight, fast C++ arcade game—playable demo with smooth controls and classic mechanics.",
    tags: ["C++", "SFML"],
  },
  {
    id: 0,
    title: "Lloyd relaxation with Voronoi stippling",
    img: voronoi,
    git: "https://github.com/Floydbene/Voronoi-Lloyd-relaxation",
    live: "https://floyds-lloyd.netlify.app/",
    information:
      "Interactive visualisation of Lloyd’s Relaxation on Voronoi diagrams and Delaunay triangulation for hands-on exploration of computational geometry.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
];

export const researches = [
  {
    id: 1,
    link: "research/caching",
    title: "Researching efficiency of ML-based caching algorithms",
    tags: ["Caching", "Machine Learning", "Algorithms"],
  },
];
