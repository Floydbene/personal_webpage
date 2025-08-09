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
        text: "Built a core React frontend (TypeScript, Vite, Zustand) that lets users upload, standardise, and map unstandardised data with in-house ML models; added real-time WebSockets with scalable polymorphic handlers for async processing updates; set up CI/CD with GitHub Actions; and led an inaugural hackathon win with an LLM-powered external validation tool that parses uploads and notifies users asynchronously.",
      },
      {
        subtitle: "Mechanism Ventures",
        imgLink: "https://mechanism.com/",
        imgUrl: mechanism,
        title: "Startup Generalist — Miami, FL",
        text: "Shipped React.js features with Jest that improved engagement and conversion for startups with $20M+ run rates; drove growth via targeted social strategies; introduced team productivity systems (Airtable, Asana, Google Sheets); and produced creative assets with Dall-E/MidJourney to speed brand rollout and reduce early marketing spend.",
      },
      {
        subtitle: "CARTS",
        title: "Full-Stack Developer — Princeton, NJ",
        imgLink: "https://www.cartsmobility.com/",
        imgUrl: carts,
        text: "Project experience retained for portfolio; not currently detailed in the 2025 CV.",
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
