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
        text: "Coursework included Machine Learning, Blockchains, Algorithm Design, Server & Website Programming, Multivariable Calculus, Linear Algebra, Convex Optimisation, Statistics, and Computation Theory.",
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
        text: "Built a core React (TypeScript, Vite, Zustand) frontend for standardising and mapping messy datasets with in-house ML models. Added real-time WebSocket channels with scalable polymorphic message handlers for async processing updates, and set up CI/CD with GitHub Actions. Led a hackathon-winning project using LLMs to validate uploads and notify users asynchronously.",
      },
      {
        subtitle: "Mechanism Ventures",
        imgLink: "https://mechanism.com/",
        imgUrl: mechanism,
        title: "Startup Generalist — Miami, FL",
        text: "Shipped product features and interactive UIs in React with Jest, boosting engagement for startups with $20M+ run rates. Drove measurable gains via social growth strategies, introduced team productivity systems (Airtable, Asana, Google Sheets), and produced brand assets with DALL·E/Midjourney to accelerate GTM.",
      },
      {
        subtitle: "CARTS",
        title: "Full-Stack Developer — Princeton, NJ",
        imgLink: "https://www.cartsmobility.com/",
        imgUrl: carts,
        text: "As part of the Trenton MOVES initiative, I simulated millions of person trips across the United States and designing a network to accommodate as many passengers travels with self-driving cars as possible. Problems include kiosk placement, ride-sharing heuristics, and empty vehicle repositioning heuristics.",
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
        text: "React (+TypeScript), Vite, Zustand, WebSockets, GitHub Actions, Jest, Flask, SQLite, Docker, Auth0, Duo, Airtable, Asana, Google Sheets, DALL·E, Midjourney.",
      },
      {
        subtitle: "languages",
        text: "English, German, Italian (native proficiency).",
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
        text: "Designed and deployed a Python/Flask + React app integrating Auth0/Duo and multiple university systems. Migrated legacy schemas with an adaptive data model to preserve integrity and UX; implemented secure, robust auth flows aligned with university standards.",
      },
      {
        subtitle: "GC Load Balancer",
        title: "Go + React load-balancing system with GC-aware routing",
        imgLink: "https://github.com/Floydbene/GC-Load-Balancer",
        imgUrl: golang,
        text: "Built a distributed task processor: Go backend with round-robin, memory-aware server selection and simulated garbage collection, a rate-limited REST API, and a React dashboard for real-time status/metrics. One-command Makefile spins up FE/BE locally.",
      },
      {
        subtitle: "Space Invaders",
        title: "Retro arcade clone",
        imgLink: "https://github.com/Floydbene/space-invaders",
        imgUrl: spaceInvaders,
        text: "From-scratch remake of the classic with a tight game loop, keyboard controls, sprite rendering, collision detection, enemy waves with increasing difficulty, and score/lives tracking.",
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
      "A high-performance Golang load-balancer simulation that dynamically distributes tasks across concurrent server nodes—with coordinated garbage-collection locking, asynchronous service responses, and a real-time React/WebSocket dashboard for live system visualization.",
    tags: ["GoLang", "React", "Zustand", "Load Balancer"],
  },
  {
    id: 6,
    title: "Space Eaters: An classic arcade game written in C++",
    img: spaceInvadersGif,
    git: "https://github.com/Floydbene/space-invaders",
    information:
      "Space Eaters is a lightning fast, lightweight video game written in C++. Come try it out!",
    tags: ["C++", "SFML"],
  },
  {
    id: 0,
    title: "Lloyd relaxation with Voronoi stippling",
    img: voronoi,
    git: "https://github.com/Floydbene/Voronoi-Lloyd-relaxation",
    live: "https://floyds-lloyd.netlify.app/",
    information:
      "This web application dynamically visualizes Lloyd's Relaxation on Voronoi diagrams and Delaunay triangulation. It enables interactive exploration of computational geometry's elegance and utility.",
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
