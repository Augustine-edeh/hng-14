<script lang="ts">
	import { ArrowUpRight, Code2, Layers } from '@lucide/svelte';
	import type { Project } from '$lib/data/portfolio';

	let { project, active = false }: { project: Project; active?: boolean } = $props();
</script>

<article
	class={`group overflow-hidden rounded-[1.6rem] border bg-white/75 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-soft dark:bg-white/7 ${
		active ? 'border-ink/40 dark:border-limebeam/70' : 'border-ink/10 dark:border-white/10'
	}`}
>
	<a href={`/projects/${project.slug}`} class="block" aria-label={`Open ${project.title} case study`}>
		<div class={`relative h-56 overflow-hidden bg-gradient-to-br ${project.accent}`}>
			<div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,15,0.08)_1px,transparent_1px),linear-gradient(rgba(6,17,15,0.08)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
			<div class="absolute left-5 top-5 rounded-full bg-ink/80 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-mist">
				{project.category}
			</div>
			<div class="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/35 bg-white/55 p-4 backdrop-blur-md">
				<div class="mb-4 flex items-center justify-between gap-3">
					<div class="grid size-12 place-items-center rounded-2xl bg-ink text-mist">
						<Layers size={22} aria-hidden="true" />
					</div>
					<span class="text-sm font-black text-ink">{project.year}</span>
				</div>
				<div class="grid grid-cols-3 gap-2">
					{#each project.metrics as metric}
						<div class="rounded-2xl bg-ink/85 p-2 text-center">
							<p class="text-base font-black text-limebeam">{metric.value}</p>
							<p class="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-mist/60">{metric.label}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</a>
	<div class="p-5 sm:p-6">
		<div class="flex items-start justify-between gap-4">
			<div>
				<h3 class="text-2xl font-black text-ink dark:text-mist">{project.title}</h3>
				<p class="mt-3 text-sm leading-7 text-ink/68 dark:text-mist/68">{project.description}</p>
			</div>
			<a
				href={`/projects/${project.slug}`}
				class="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-mist transition group-hover:-translate-y-1 group-hover:rotate-6 dark:bg-limebeam dark:text-ink"
				aria-label={`View ${project.title}`}
			>
				<ArrowUpRight size={19} aria-hidden="true" />
			</a>
		</div>
		<div class="mt-5 flex flex-wrap gap-2">
			{#each project.technologies.slice(0, 4) as tech}
				<span class="rounded-full bg-ink/6 px-3 py-1 text-xs font-bold text-ink/70 dark:bg-white/10 dark:text-mist/70">
					{tech}
				</span>
			{/each}
		</div>
		<div class="mt-6 flex flex-wrap gap-3">
			<a
				href={project.liveUrl}
				class="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-black text-mist transition hover:-translate-y-0.5 dark:bg-limebeam dark:text-ink"
			>
				Live demo <ArrowUpRight size={15} aria-hidden="true" />
			</a>
			<a
				href={project.githubUrl}
				class="inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm font-black text-ink transition hover:-translate-y-0.5 dark:border-white/10 dark:text-mist"
			>
				<Code2 size={15} aria-hidden="true" /> Repo
			</a>
		</div>
	</div>
</article>
