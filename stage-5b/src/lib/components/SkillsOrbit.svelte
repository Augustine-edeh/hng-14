<script lang="ts">
	import { Zap } from '@lucide/svelte';
	import SectionShell from './SectionShell.svelte';
	import { skills } from '$lib/data/portfolio';

	let active = $state(skills[0]);
</script>

<SectionShell
	id="skills"
	kicker="Capability map"
	title="A compact skill system built for product speed"
	description="The interface is deliberately playful, but the skill taxonomy stays practical: state, performance, accessibility, motion, and architecture."
>
	<div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
		<div class="relative mx-auto aspect-square w-full max-w-md">
			<div class="absolute inset-0 rounded-full border border-dashed border-ink/20 dark:border-white/20"></div>
			<div class="absolute inset-8 rounded-full border border-ink/10 dark:border-white/10"></div>
			<div class="absolute inset-0 animate-[orbit_42s_linear_infinite]">
				{#each skills.slice(0, 8) as skill, index}
					<button
						type="button"
						class="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-ink/10 bg-white text-[0.65rem] font-black leading-tight text-ink shadow-sm transition hover:scale-110 dark:border-white/10 dark:bg-white/10 dark:text-mist"
						style={`transform: rotate(${index * 45}deg) translateY(-12rem) rotate(-${index * 45}deg) translate(-50%, -50%);`}
						aria-label={`Select ${skill}`}
						onclick={() => (active = skill)}
					>
						<span class="max-w-14">{skill}</span>
					</button>
				{/each}
			</div>
			<div class="absolute inset-1/2 grid size-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2rem] bg-ink p-4 text-center text-mist shadow-soft dark:bg-limebeam dark:text-ink">
				<Zap size={24} aria-hidden="true" />
				<p class="mt-2 text-sm font-black">{active}</p>
			</div>
		</div>

		<div class="grid gap-3 sm:grid-cols-2">
			{#each skills as skill}
				<button
					type="button"
					class={`rounded-3xl border p-4 text-left text-sm font-black transition hover:-translate-y-1 ${
						active === skill
							? 'border-ink bg-ink text-mist dark:border-limebeam dark:bg-limebeam dark:text-ink'
							: 'border-ink/10 bg-white/70 text-ink/70 dark:border-white/10 dark:bg-white/5 dark:text-mist/70'
					}`}
					onclick={() => (active = skill)}
				>
					{skill}
				</button>
			{/each}
		</div>
	</div>
</SectionShell>
