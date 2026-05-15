<script lang="ts">
	import { browser } from '$app/environment';
	import { Sun, Moon, Command, Menu, X, Download } from '@lucide/svelte';
	import { profile } from '$lib/data/portfolio';

	let {
		onCommand
	}: {
		onCommand: () => void;
	} = $props();

	let open = $state(false);
	let dark = $state(false);

	const links = [
		{ label: 'Projects', href: '/#projects' },
		{ label: 'Skills', href: '/#skills' },
		{ label: 'Timeline', href: '/#timeline' },
		{ label: 'Contact', href: '/#contact' }
	];

	function applyTheme(value: boolean) {
		dark = value;
		if (browser) {
			document.documentElement.classList.toggle('dark', dark);
			localStorage.setItem('theme', dark ? 'dark' : 'light');
		}
	}

	$effect(() => {
		if (!browser) return;
		const stored = localStorage.getItem('theme');
		applyTheme(stored ? stored === 'dark' : true);
	});
</script>

<header
	class="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-mist/80 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-8 dark:border-white/10 dark:bg-void/75"
>
	<a
		href="#main"
		class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-voltage focus:px-4 focus:py-2 focus:font-bold focus:text-ink"
	>
		Skip to content
	</a>
	<nav class="mx-auto flex max-w-7xl items-center justify-between gap-3" aria-label="Main navigation">
		<a href="/" class="group flex min-w-0 items-center gap-3" aria-label={`${profile.name} home`}>
			<span
				class="grid size-10 shrink-0 place-items-center rounded-2xl bg-ink text-sm font-black text-limebeam shadow-soft transition group-hover:rotate-6 dark:bg-limebeam dark:text-ink"
			>
				AC
			</span>
			<span class="hidden min-w-0 sm:block">
				<span class="block text-sm font-black text-ink dark:text-mist">{profile.name}</span>
				<span class="block text-xs font-semibold text-ink/60 dark:text-mist/60">{profile.role}</span>
			</span>
		</a>

		<div class="hidden items-center gap-1 rounded-full border border-ink/10 bg-white/55 p-1 dark:border-white/10 dark:bg-white/5 md:flex">
			{#each links as link}
				<a
					class="rounded-full px-4 py-2 text-sm font-bold text-ink/70 transition hover:bg-ink hover:text-mist dark:text-mist/70 dark:hover:bg-mist dark:hover:text-ink"
					href={link.href}
				>
					{link.label}
				</a>
			{/each}
		</div>

		<div class="flex items-center gap-2">
			<a
				href={profile.resumeUrl}
				class="hidden items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-black text-mist transition hover:-translate-y-0.5 hover:bg-blue-950 dark:bg-limebeam dark:text-ink sm:flex"
			>
				<Download size={16} aria-hidden="true" />
				Resume
			</a>
			<button
				type="button"
				class="grid size-10 place-items-center rounded-full border border-ink/10 bg-white/70 text-ink transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:text-mist"
				aria-label="Open command palette"
				onclick={onCommand}
			>
				<Command size={18} aria-hidden="true" />
			</button>
			<button
				type="button"
				class="grid size-10 place-items-center rounded-full border border-ink/10 bg-white/70 text-ink transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:text-mist"
				aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
				onclick={() => applyTheme(!dark)}
			>
				{#if dark}<Sun size={18} aria-hidden="true" />{:else}<Moon size={18} aria-hidden="true" />{/if}
			</button>
			<button
				type="button"
				class="grid size-10 place-items-center rounded-full border border-ink/10 bg-white/70 text-ink md:hidden dark:border-white/10 dark:bg-white/10 dark:text-mist"
				aria-label={open ? 'Close menu' : 'Open menu'}
				aria-expanded={open}
				onclick={() => (open = !open)}
			>
				{#if open}<X size={19} aria-hidden="true" />{:else}<Menu size={19} aria-hidden="true" />{/if}
			</button>
		</div>
	</nav>

	{#if open}
		<div class="mx-auto mt-3 grid max-w-7xl gap-2 rounded-3xl border border-ink/10 bg-white p-3 shadow-soft dark:border-white/10 dark:bg-ink md:hidden">
			{#each links as link}
				<a
					class="rounded-2xl px-4 py-3 text-sm font-black text-ink/80 hover:bg-mist dark:text-mist dark:hover:bg-white/10"
					href={link.href}
					onclick={() => (open = false)}
				>
					{link.label}
				</a>
			{/each}
			<a
				href={profile.resumeUrl}
				class="rounded-2xl bg-ink px-4 py-3 text-sm font-black text-mist dark:bg-limebeam dark:text-ink"
			>
				Download resume
			</a>
		</div>
	{/if}
</header>
