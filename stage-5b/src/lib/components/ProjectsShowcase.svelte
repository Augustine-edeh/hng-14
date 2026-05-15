<script lang="ts">
	import { fly } from 'svelte/transition';
	import ProjectCard from './ProjectCard.svelte';
	import SectionShell from './SectionShell.svelte';
	import { projects } from '$lib/data/portfolio';

	const filters = ['All', 'Product', 'AI', 'Data', 'Experience'] as const;
	let selected = $state<(typeof filters)[number]>('All');
	let filtered = $derived(selected === 'All' ? projects : projects.filter((project) => project.category === selected));
</script>

<SectionShell
	id="projects"
	kicker="Selected systems"
	title="Dynamic projects with cinematic previews"
	description="Each project is modeled as data and rendered through reusable cards, detail routes, animated filters, and touch-friendly actions."
>
	<div class="mb-8 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Project categories">
		{#each filters as filter}
			<button
				type="button"
				class={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${
					selected === filter
						? 'bg-ink text-mist dark:bg-limebeam dark:text-ink'
						: 'border border-ink/10 bg-white/65 text-ink/70 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-mist/70'
				}`}
				role="tab"
				aria-selected={selected === filter}
				onclick={() => (selected = filter)}
			>
				{filter}
			</button>
		{/each}
	</div>

	<div class="grid gap-5 md:grid-cols-2">
		{#each filtered as project, index (project.slug)}
			<div in:fly={{ y: 18, duration: 260, delay: index * 55 }}>
				<ProjectCard {project} active={index === 0} />
			</div>
		{/each}
	</div>
</SectionShell>
