export type Project = {
	slug: string;
	title: string;
	category: 'Product' | 'AI' | 'Data' | 'Experience';
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
	name: 'Augustine Chukwu',
	role: 'Frontend Engineer',
	tagline: 'I build fast, expressive web experiences where motion, clarity, and product thinking meet.',
	email: 'hello@augustine.dev',
	resumeUrl: '/resume.pdf',
	socials: [
		{ label: 'GitHub', href: 'https://github.com/augustine' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/augustine' },
		{ label: 'Twitter', href: 'https://x.com/augustine' }
	]
};

export const projects: Project[] = [
	{
		slug: 'orbit-bank',
		title: 'Orbit Bank Console',
		category: 'Product',
		description:
			'A real-time fintech operations dashboard with risk queues, transaction intelligence, and calm high-density workflows.',
		impact: 'Reduced support triage time by 38% through contextual queueing and keyboard-first investigation flows.',
		technologies: ['SvelteKit', 'TypeScript', 'TailwindCSS', 'Web Workers', 'IndexedDB'],
		liveUrl: 'https://example.com/orbit-bank',
		githubUrl: 'https://github.com/augustine/orbit-bank',
		year: '2026',
		accent: 'from-seaglass to-limebeam',
		metrics: [
			{ label: 'LCP', value: '1.1s' },
			{ label: 'Queues', value: '12' },
			{ label: 'A11y', value: '100' }
		],
		screens: ['Risk radar', 'Transaction graph', 'Agent workspace']
	},
	{
		slug: 'scribe-ai',
		title: 'Scribe AI Workspace',
		category: 'AI',
		description:
			'An AI writing cockpit with prompt branching, citation review, model routing, and collaborative editing.',
		impact: 'Helped content teams compare model output and ship reviewed drafts with source confidence indicators.',
		technologies: ['SvelteKit', 'Streaming UI', 'TailwindCSS', 'Server Actions', 'Zod'],
		liveUrl: 'https://example.com/scribe-ai',
		githubUrl: 'https://github.com/augustine/scribe-ai',
		year: '2026',
		accent: 'from-voltage to-coral',
		metrics: [
			{ label: 'Latency', value: '-44%' },
			{ label: 'Flows', value: '8' },
			{ label: 'Tokens', value: 'Live' }
		],
		screens: ['Prompt branches', 'Citation rail', 'Draft compare']
	},
	{
		slug: 'atlas-field',
		title: 'Atlas Field OS',
		category: 'Data',
		description:
			'A mobile-first logistics map for dispatchers and riders with offline state recovery and route health signals.',
		impact: 'Kept critical route updates usable on unstable networks with optimistic updates and queue replay.',
		technologies: ['Svelte', 'TailwindCSS', 'PWA', 'Service Worker', 'Map UI'],
		liveUrl: 'https://example.com/atlas-field',
		githubUrl: 'https://github.com/augustine/atlas-field',
		year: '2025',
		accent: 'from-limebeam to-voltage',
		metrics: [
			{ label: 'Offline', value: 'Ready' },
			{ label: 'Bundle', value: '86kb' },
			{ label: 'Routes', value: '240+' }
		],
		screens: ['Dispatch map', 'Route timeline', 'Offline queue']
	},
	{
		slug: 'signal-lab',
		title: 'Signal Lab',
		category: 'Experience',
		description:
			'A cinematic portfolio-grade experiment suite for audio-reactive cards, command navigation, and tactile UI states.',
		impact: 'Explored performant motion systems with reduced-motion fallbacks and GPU-friendly transforms.',
		technologies: ['Svelte 5', 'Runes', 'TailwindCSS', 'Canvas', 'View Transitions'],
		liveUrl: 'https://example.com/signal-lab',
		githubUrl: 'https://github.com/augustine/signal-lab',
		year: '2026',
		accent: 'from-coral to-seaglass',
		metrics: [
			{ label: 'FPS', value: '60' },
			{ label: 'Modes', value: '5' },
			{ label: 'Motion', value: 'Safe' }
		],
		screens: ['Audio cards', 'Command deck', 'Motion lab']
	}
];

export const skills = [
	'SvelteKit',
	'Svelte 5 runes',
	'TypeScript',
	'TailwindCSS',
	'Animation systems',
	'Performance budgets',
	'Accessibility',
	'Design systems',
	'API integration',
	'Testing strategy',
	'Progressive enhancement',
	'Product thinking'
];

export const timeline = [
	{
		year: 'Now',
		title: 'Frontend systems for high-trust products',
		body: 'Designing interfaces that stay responsive under data load, motion, and real user pressure.'
	},
	{
		year: '2025',
		title: 'Interaction engineering',
		body: 'Built composable animation patterns, keyboard flows, and resilient optimistic UI primitives.'
	},
	{
		year: '2024',
		title: 'Product-led frontend',
		body: 'Shipped dashboards, onboarding flows, and developer tools with a bias for clarity and speed.'
	}
];
