import { Project } from "@/types";

export const projects: Project[] = [
  {
    tag: "Client Project",
    title: "18-04 Unisex Salon",
    description:
      "A full-featured salon booking platform built for a Lagos-based unisex salon. Features service selection, appointment scheduling, home service support, a responsive gallery, and an optimised mobile experience.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Shadcn/ui",
      "Formspree",
    ],
    // liveUrl: "https://18-04salon.vercel.app", //NOTE: Original URL for salon project, but temporarily replaced with services page demo URL for client presentations while salon project is still in development
    liveUrl:
      "https://18-04-git-featservices-page-int-ed3ad2-augustine-edehs-projects.vercel.app/", //NOTE: Temporary URL for services page demo to clients
    // githubUrl: "https://github.com/Augustine-edeh/18-04",
    image: "/images/18-04.png",
    accent: true,
  },

  {
    tag: "Client Project",
    title: "Fruitstatic Edibles",
    description:
      "A vibrant website for a creative SME offering fruit platters, smoothies, and event planning - blending e-commerce with service showcase",
    techStack: ["NextJs", "TypeScript", "Zustand", "Tailwind CSS"],
    liveUrl: "https://fruitstatic-edibles.vercel.app/",
    // githubUrl: "https://github.com/Augustine-edeh/fruitstatic-edibles",
    image: "/images/fruitastic-edibles_3.png",
    accent: true,
  },
  {
    tag: "Passion Project",
    title: "Tech Care",
    description:
      "A healthcare dashboard for managing and visualising patient data. Built with a service-based API layer, Zustand global state management, and responsive chart components for tracking patient records across time ranges.",
    techStack: ["React", "TypeScript", "Zustand", "Tailwind CSS"],
    liveUrl: "https://techcare-247.vercel.app/",
    // githubUrl: "https://github.com/Augustine-edeh/Tech-Care-247",
    image: "/images/tech-care.png",
    accent: true,
  },
];
