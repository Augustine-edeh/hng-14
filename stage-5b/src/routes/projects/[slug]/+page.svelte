<script lang="ts">
	import { ArrowLeft, ArrowUpRight, Code2 } from '@lucide/svelte';
	import AppNav from '$lib/components/AppNav.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import type { Project } from '$lib/data/portfolio';

	let { data }: { data: { project: Project } } = $props();
	let commandOpen = $state(false);
	let project = $derived(data.project);
</script>

<svelte:head>
	<title>{project.title} | Augustine Chukwu</title>
	<meta name="description" content={project.description} />
</svelte:head>

<AppNav onCommand={() => (commandOpen = true)} />
<CommandPalette open={commandOpen} onClose={() => (commandOpen = false)} />

<main id="main" class="min-h-screen bg-mist px-4 pb-20 pt-28 text-ink sm:px-6 lg:px-8 dark:bg-void dark:text-mist">
	<div class="mx-auto max-w-7xl">
		<a
			href="/#projects"
			class="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-black text-ink transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:text-mist"
		>
			<ArrowLeft size={16} aria-hidden="true" /> Back to projects
		</a>

		<section class="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
			<div>
				<p class="text-sm font-black uppercase tracking-[0.22em] text-emerald-700 dark:text-limebeam">
					{project.category} / {project.year}
				</p>
				<h1 class="mt-4 text-4xl font-black leading-tight sm:text-6xl">{project.title}</h1>
				<p class="mt-5 text-lg leading-8 text-ink/70 dark:text-mist/70">{project.description}</p>
				<p class="mt-5 rounded-[1.5rem] border border-ink/10 bg-white/70 p-5 text-base font-semibold leading-8 text-ink/72 dark:border-white/10 dark:bg-white/5 dark:text-mist/72">
					{project.impact}
				</p>
				<div class="mt-6 flex flex-wrap gap-3">
					<a
						href={project.liveUrl}
						class="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-mist transition hover:-translate-y-1 dark:bg-limebeam dark:text-ink"
					>
						Live demo <ArrowUpRight size={16} aria-hidden="true" />
					</a>
					<a
						href={project.githubUrl}
						class="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-5 py-3 text-sm font-black text-ink transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/10 dark:text-mist"
					>
						<Code2 size={16} aria-hidden="true" /> Repository
					</a>
				</div>
			</div>

			<div class={`overflow-hidden rounded-[2rem] bg-gradient-to-br ${project.accent} p-4 shadow-soft`}>
				<div class="rounded-[1.5rem] border border-white/35 bg-white/65 p-4 backdrop-blur">
					<div class="mb-4 flex items-center gap-2">
						<span class="size-3 rounded-full bg-coral"></span>
						<span class="size-3 rounded-full bg-voltage"></span>
						<span class="size-3 rounded-full bg-seaglass"></span>
						<span class="ml-auto text-xs font-black uppercase tracking-[0.18em] text-ink/60">case preview</span>
					</div>
					<div class="grid gap-3">
						{#each project.screens as screen, index}
							<div class="rounded-3xl bg-ink p-4 text-mist">
								<div class="flex items-center justify-between gap-3">
									<p class="font-black">{screen}</p>
									<p class="text-xs font-black text-limebeam">0{index + 1}</p>
								</div>
								<div class="mt-4 grid grid-cols-4 gap-2">
									{#each Array(8) as _, dot}
										<span class={`h-9 rounded-xl ${dot % 3 === 0 ? 'bg-limebeam' : dot % 2 === 0 ? 'bg-seaglass/70' : 'bg-white/12'}`}></span>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>

		<section class="mt-12 grid gap-4 sm:grid-cols-3">
			{#each project.metrics as metric}
				<div class="rounded-[1.5rem] border border-ink/10 bg-white/70 p-5 text-center dark:border-white/10 dark:bg-white/5">
					<p class="text-3xl font-black text-emerald-700 dark:text-limebeam">{metric.value}</p>
					<p class="mt-2 text-xs font-black uppercase tracking-[0.2em] text-ink/50 dark:text-mist/50">{metric.label}</p>
				</div>
			{/each}
		</section>

		<section class="mt-12 rounded-[1.5rem] border border-ink/10 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
			<h2 class="text-2xl font-black">Technology decisions</h2>
			<div class="mt-5 flex flex-wrap gap-2">
				{#each project.technologies as tech}
					<span class="rounded-full bg-ink px-4 py-2 text-sm font-black text-mist dark:bg-limebeam dark:text-ink">{tech}</span>
				{/each}
			</div>
		</section>
	</div>
</main>
