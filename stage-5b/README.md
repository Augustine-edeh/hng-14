# Interactive Svelte Developer Portfolio

An immersive, mobile-first developer portfolio built with SvelteKit, Svelte 5, TypeScript, and TailwindCSS. The experience is designed to feel engineered rather than static: animated hero lighting, data-driven project filtering, project detail routes, an interactive terminal, command palette navigation, theme persistence, and an accessible contact flow.

## Setup

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
npm run preview
```

## Architecture

- `src/lib/data/portfolio.ts` stores profile, projects, skills, and timeline content as typed data.
- `src/lib/components/` contains standalone UI sections: hero, navigation, project cards, skills orbit, terminal, timeline, contact, and command palette.
- `src/routes/+page.svelte` composes the main portfolio experience.
- `src/routes/projects/[slug]/` provides proper SvelteKit routing for project case studies.
- Styling is Tailwind-first, with only small global CSS additions for Tailwind v4 theme tokens and reusable keyframes.

## Interaction And Animation Decisions

- Hero uses pointer-reactive radial lighting and staggered Svelte transitions for an immediate cinematic entrance.
- Project cards use GPU-friendly transforms, data-driven filters, responsive mock screenshots, and detail-route transitions.
- The terminal is the advanced creative feature: it accepts sanitized commands, exposes projects/skills/contact info, and bounds history output.
- The command palette provides fast keyboard-friendly navigation and works across the home page and project routes.
- Animations are consistent and intentionally restrained; reduced-motion users receive system-level motion reduction.

## Performance Optimizations

- SvelteKit route-level code splitting is used by default.
- Project content is local typed data, avoiding runtime CMS/API latency.
- Visuals are CSS/Tailwind-driven instead of heavy images, keeping the initial bundle lean.
- Animations favor transforms, opacity, and lightweight keyframes.
- Contact uses `mailto:` rather than shipping a secret-bearing integration.

## Accessibility

- Semantic landmarks, headings, forms, labels, and buttons are used throughout.
- A skip link is available for keyboard users.
- Focus states are visible globally.
- Theme state persists and respects the user's system preference on first load.
- Contact validation returns clear status/error messaging.
- Motion reduction is supported via `prefers-reduced-motion`.

## Security And Stability

- Terminal and contact form inputs strip angle brackets and enforce length limits.
- The contact workflow does not expose API keys or third-party secrets.
- Project routes return a 404 for unknown slugs.
- External URLs are centralized in typed project data for easier auditing before deployment.

## Deployment

The project uses `@sveltejs/adapter-static` with prerendered routes, so it can deploy cleanly to Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any static host. Before final submission, replace `static/resume.pdf` with the final resume and update project/social links in `src/lib/data/portfolio.ts`.

## Trade-offs

- Visual project screenshots are generated as lightweight Tailwind UI mockups instead of large image assets to maximize performance.
- The contact form uses a robust mailto fallback instead of a server email integration to avoid exposed secrets in a frontend-only submission.
