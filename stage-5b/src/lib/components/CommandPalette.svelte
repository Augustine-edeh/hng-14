<script lang="ts">
	import { browser } from '$app/environment';
	import { Search, X } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';
	import { projects } from '$lib/data/portfolio';

	let {
		open,
		onClose
	}: {
		open: boolean;
		onClose: () => void;
	} = $props();

	let query = $state('');
	const baseActions = [
		{ label: 'Go to projects', href: '/#projects', hint: 'Section' },
		{ label: 'Open terminal', href: '/#terminal', hint: 'Creative feature' },
		{ label: 'View skills', href: '/#skills', hint: 'Capability map' },
		{ label: 'Contact Augustine', href: '/#contact', hint: 'Mail form' }
	];
	const actions = $derived([
		...baseActions,
		...projects.map((project) => ({
			label: project.title,
			href: `/projects/${project.slug}`,
			hint: project.category
		}))
	]);
	const filtered = $derived(
		actions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase())).slice(0, 7)
	);

	$effect(() => {
		if (!browser) return;
		function keydown(event: KeyboardEvent) {
			if (event.key === 'Escape' && open) onClose();
		}
		window.addEventListener('keydown', keydown);
		return () => window.removeEventListener('keydown', keydown);
	});
</script>

{#if open}
	<div class="fixed inset-0 z-50 grid place-items-start bg-ink/55 px-4 pt-24 backdrop-blur-sm sm:place-items-center sm:pt-0" transition:fade>
		<button class="absolute inset-0 cursor-default" aria-label="Close command palette" onclick={onClose}></button>
		<div
			class="relative w-full max-w-2xl overflow-hidden rounded-[1.6rem] border border-white/10 bg-mist shadow-soft dark:bg-ink"
			role="dialog"
			aria-modal="true"
			aria-label="Command palette"
			transition:fly={{ y: 18, duration: 180 }}
		>
			<div class="flex items-center gap-3 border-b border-ink/10 p-4 dark:border-white/10">
				<Search size={19} class="text-ink/55 dark:text-mist/55" aria-hidden="true" />
				<label class="sr-only" for="command-search">Search commands</label>
				<input
					id="command-search"
					class="min-w-0 flex-1 bg-transparent text-base font-bold text-ink outline-none placeholder:text-ink/35 dark:text-mist dark:placeholder:text-mist/35"
					placeholder="Search projects or actions..."
					bind:value={query}
				/>
				<button class="grid size-9 place-items-center rounded-full hover:bg-ink/6 dark:hover:bg-white/10" type="button" aria-label="Close" onclick={onClose}>
					<X size={18} aria-hidden="true" />
				</button>
			</div>
			<div class="p-2">
				{#each filtered as action}
					<a
						href={action.href}
						class="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition hover:bg-white dark:hover:bg-white/10"
						onclick={onClose}
					>
						<span class="font-black text-ink dark:text-mist">{action.label}</span>
						<span class="rounded-full bg-ink/6 px-3 py-1 text-xs font-bold text-ink/55 dark:bg-white/10 dark:text-mist/55">{action.hint}</span>
					</a>
				{/each}
				{#if filtered.length === 0}
					<p class="px-4 py-8 text-center text-sm font-bold text-ink/55 dark:text-mist/55">No matching command.</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
