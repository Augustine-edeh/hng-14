<script lang="ts">
	import { timeline } from '$lib/data/portfolio';
	import SectionShell from './SectionShell.svelte';
</script>

<SectionShell
	id="timeline"
	kicker="Narrative"
	title="Cinematic career flow"
	description="A simple scroll-friendly timeline keeps the story readable on mobile while still feeling engineered and intentional."
>
	<div class="relative">
		<div class="absolute left-4 top-0 hidden h-full w-px bg-ink/10 dark:bg-white/10 sm:block"></div>
		<div class="grid gap-4">
			{#each timeline as item}
				<article class="grid gap-4 rounded-[1.5rem] border border-ink/10 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:grid-cols-[7rem_1fr] sm:p-6">
					<div class="relative">
						<span class="hidden absolute left-0 top-1 size-8 -translate-x-[1.45rem] rounded-full border-4 border-mist bg-seaglass dark:border-void sm:block"></span>
						<p class="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-limebeam">{item.year}</p>
					</div>
					<div>
						<h3 class="text-xl font-black text-ink dark:text-mist">{item.title}</h3>
						<p class="mt-2 leading-7 text-ink/66 dark:text-mist/66">{item.body}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</SectionShell>
