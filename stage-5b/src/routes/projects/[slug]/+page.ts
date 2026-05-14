import { error } from '@sveltejs/kit';
import { projects } from '$lib/data/portfolio';

export function load({ params }) {
	const project = projects.find((item) => item.slug === params.slug);
	if (!project) error(404, 'Project not found');
	return { project };
}

export function entries() {
	return projects.map((project) => ({ slug: project.slug }));
}
