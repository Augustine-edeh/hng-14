export type Project = {
  slug: string;
  title: string;
  category: "Client Project" | "Passion Project";
  description: string;
  impact: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  year: string;
  accent: string;
  metrics: { label: string; value: string }[];
  screens: string[];
};

export const profile = {
  name: "Augustine Edeh",
  role: "Frontend Engineer",
  tagline:
    "I build fast, expressive web experiences where motion, clarity, and product thinking meet.",
  email: "info.augustinesedeh@gmail.com",
  resumeUrl: "/Augustine Edeh_resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/Augustine-edeh" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/augustine-edeh" },
  ],
};

export const projects: Project[] = [
  {
    slug: "18-04-unisex-salon",
    title: "18-04 Unisex Salon",
    category: "Client Project",
    description:
      "A full-featured salon booking platform built for a Lagos-based unisex salon, with service selection, appointment scheduling, home service support, a responsive gallery, and an optimised mobile experience.",
    impact:
      "Built a polished client booking flow that helps customers move from service discovery to appointment requests with fewer steps.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Shadcn/ui",
      "Formspree",
    ],
    liveUrl: "https://18-04salon.vercel.app",
    githubUrl: "https://github.com/Augustine-edeh/18-04",
    year: "2026",
    accent: "from-seaglass to-limebeam",
    metrics: [
      { label: "Type", value: "Client" },
      { label: "Flow", value: "Booking" },
      { label: "Mobile", value: "Ready" },
    ],
    screens: ["Services page", "Booking flow", "Mobile gallery"],
  },
  {
    slug: "fruitstatic-edibles",
    title: "Fruitstatic Edibles",
    category: "Client Project",
    description:
      "A vibrant website for a creative SME offering fruit platters, smoothies, and event planning, blending e-commerce cues with a service showcase.",
    impact:
      "Created a bright, responsive storefront that communicates the brand clearly and makes browsing products and services simple.",
    technologies: ["Next.js", "TypeScript", "Zustand", "Tailwind CSS"],
    liveUrl: "https://fruitstatic-edibles.vercel.app/",
    githubUrl: "https://github.com/Augustine-edeh/fruitstatic-edibles",
    year: "2026",
    accent: "from-voltage to-coral",
    metrics: [
      { label: "Type", value: "Client" },
      { label: "State", value: "Zustand" },
      { label: "Stack", value: "Next" },
    ],
    screens: ["Product showcase", "Service sections", "Responsive pages"],
  },
  {
    slug: "tech-care",
    title: "Tech Care",
    category: "Passion Project",
    description:
      "A healthcare dashboard for managing and visualising patient data, built with a service-based API layer, Zustand global state management, and responsive chart components.",
    impact:
      "Turned patient records into a clear dashboard experience with reusable data services and chart-driven health summaries.",
    technologies: ["React", "TypeScript", "Zustand", "Tailwind CSS"],
    liveUrl: "https://techcare-247.vercel.app/",
    githubUrl: "https://github.com/Augustine-edeh/Tech-Care-247",
    year: "2025",
    accent: "from-limebeam to-voltage",
    metrics: [
      { label: "Type", value: "Build" },
      { label: "Charts", value: "Live" },
      { label: "Data", value: "API" },
    ],
    screens: ["Patient dashboard", "Health chart", "Patient profile"],
  },
];

export const skills = [
  "SvelteKit",
  "Svelte 5 runes",
  "TypeScript",
  "TailwindCSS",
  "Animation systems",
  "Performance budgets",
  "Accessibility",
  "Design systems",
  "API integration",
  "Testing strategy",
  "Progressive enhancement",
  "Product thinking",
];

export const timeline = [
  {
    year: "Now",
    title: "HNG Internship",
    body: "Currently building and shipping staged frontend tasks through the HNG program.",
  },
  {
    year: "2025",
    title: "Interaction engineering",
    body: "Built composable animation patterns, keyboard flows, and resilient optimistic UI primitives.",
  },
  {
    year: "2024",
    title: "Product-led frontend",
    body: "Shipped dashboards, onboarding flows, and developer tools with a bias for clarity and speed.",
  },
];
