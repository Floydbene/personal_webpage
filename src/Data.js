import bh from './assets/bh.jpg';
import Miami from './assets/Miami.jpeg';
import world from './assets/world.gif';
import unsplash from './assets/unsplash.jpg';
import lloyd from './assets/lloyd.png';

export const resumeData = [
  {
    id: 1,
    title: 'education',
    subtitles: [
      {
        subtitle: 'Princeton',
        imgLink: 'https://www.cs.princeton.edu/',
        imgUrl:
          'https://upload.wikimedia.org/wikipedia/commons/d/d0/Princeton_seal.svg',
        title: 'Bachelor of science and engineering in computer science',
        text: 'I graduated with a B.S.E. in Computer Science, maintaining a 3.73/4.00 GPA, and was honored with the IRA All-Academic Award in my senior year. My coursework spanned Mathematics, Programming, Natural Sciences, and Technology Policy, with a focus on subjects like Machine Learning and Algorithm Design. Notably, I conducted in-depth research on machine learning caching algorithms and blockchains, resulting in a detailed 35-page paper and presentation.',
      },
      {
        subtitle: 'Independent work',
        title:
          'Effects of social media impressions on highly volatile cryptocurrencies',
        text: 'For my independent work in lieu of a 2-semester thesis, I decided to analyze the correlation/causation between social media impressions concerning different cryptocurrencies and the tradiung volume, price and other metrics. To do so, I used a variety of statistical methods, including linear regression. Beyond using APIs and scrapers to gather a plethera of posts, comments, likes and other social media options, I used natural language processing to analyze the sentiment and use it as a supporting parameter to train a predictive algorithm for trading volume and price..',
      },
      {
        subtitle: 'Research',
        title: 'Testing the efficacy of ML-based caching algorithms',
        text: 'In partial completion of my bachelors degree, I completed a research project on ML-based caching algorithms. In this, I used efficiency graphs for varying types of complex operations that could be expected of a cache to analyze use cases, as well as strengths and weaknesses of differnet ML-based caching algorithms.',
      },
    ],
  },
  {
    id: 2,
    title: 'work',
    subtitles: [
      {
        subtitle: 'Mechanism',
        imgLink: 'https://mechanism.com/',
        title: 'Operator in Residence',
        imgUrl:
          'https://media.licdn.com/dms/image/C4D0BAQGUh1pXgjjk_A/company-logo_200_200/0/1630506519843/mechanism_ventures_logo?e=1714608000&v=beta&t=81ddJ-KM0lfmarS4CsTFDIwLgvfCBR-VIt5CP9Uc0r0',
        text: 'At Mechanism Ventures, a Startup studio managing 10 startups, I developed social media marketing strategies that significantly increased engagement for startups with run rates surpassing $20M. I leveraged Python to analyze large datasets for SEO, refining conversion strategies. My role also involved fostering collaboration between corporate and startup teams, ensuring marketing efforts were in sync with aggressive growth objectives .',
      },
      {
        subtitle: 'CARTS',
        title: 'Full-Stack Developer',
        imgLink: 'https://www.cartsmobility.com/',
        imgUrl:
          'https://media.licdn.com/dms/image/C4D0BAQFkybg3R4EHWg/company-logo_200_200/0/1637793842578?e=1714608000&v=beta&t=8u_fIcEHVelYXs-w4e2jmAH97KUEpWNrJTTviMm0Yww',
        text: 'As part of the Trenton MOVES initiative, I simulated millions of person trips across the United States and designing a network to accommodate as many passengers travels with self-driving cars as possible. Problems include kiosk placement, ride-sharing heuristics, and empty vehicle repositioning heuristics.',
      },
    ],
  },
  {
    id: 3,
    title: 'hard skills',
    subtitles: [
      {
        subtitle: 'programming languages',
        text: 'Java, C, Python, HTML, CSS, JavaScript, React.js, Node.js,',
      },
      {
        subtitle: 'languages',
        text: 'English (native), Italian (native) and German (native)',
      },
    ],
  },
];

export const portfolio = [
  {
    id: 0,
    title: 'Lloyd relaxation with Voronoi stippling',
    img: lloyd,
    git: 'https://github.com/Floydbene/Voronoi-Lloyd-relaxation',
    live: 'https://floyds-lloyd.netlify.app/',
    information:
      'Before generating the current page, I bootstrapped a portfolio using only HTML, CSS and JS. This was an introduction to web development, as well as a fun way to present.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 1,
    title: 'my old personal webpage',
    img: bh,
    git: 'https://github.com/Floydbene/personal_webpage',
    live: 'https://floydbene.github.io/meetfloyd/',
    information:
      "This web application dynamically visualizes Lloyd's Relaxation on Voronoi diagrams and Delaunay triangulation. It enables interactive exploration of computational geometry's elegance and utility.",
    tags: ['HTML', 'CSS', 'JavaScript', 'TailWindCSS'],
  },
  {
    id: 2,
    title: 'unsplash API retriever',
    img: unsplash,
    git: 'https://github.com/Floydbene/API_Example_project',
    live: 'https://api-example-unsplash.netlify.app/',
    information:
      'This is a simple web application to use APIs thats pulls images from the unsplash API database.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Axios', 'API', 'React'],
  },
  {
    id: 3,
    title: 'restcountries API retriever',
    img: world,
    git: 'https://github.com/Floydbene/Countries',
    live: 'https://moonlit-cobbler-9fa07e.netlify.app/',
    information:
      'This is a simple web application that uses APIs to pull information about all of the countries in the RestCountries API database.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Axios', 'API', 'React'],
  },
  {
    id: 4,
    title: 'Miami fan page',
    img: Miami,
    git: 'https://github.com/Floydbene/MiamiPage',
    live: 'https://miamifanpage.netlify.app/',
    information:
      'This is a sample advertising application where I used the city of Miami as a subject.',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
];

export const researches = [
  {
    id: 0,
    link: "research/crypto",
    title: 'Researching causation of social media impressions on Cryptocurrencies',
    information:
      'Before generating the current page, I bootstrapped a portfolio using only HTML, CSS and JS. This was an introduction to web development, as well as a fun way to present.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 1,
    link: "research/caching",
    title: 'Researching efficiency of ML-based caching algorithms',
    information:
      'Before generating the current page, I bootstrapped a portfolio using only HTML, CSS and JS. This was an introduction to web development, as well as a fun way to present.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
];
