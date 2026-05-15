<script lang="ts">
	import { ArrowRight, BriefcaseBusiness, Code2, Mail, MousePointer2 } from '@lucide/svelte';
	import { fly, scale } from 'svelte/transition';
	import { profile, skills } from '$lib/data/portfolio';

	let pointerX = $state(50);
	let pointerY = $state(50);

	function track(event: PointerEvent) {
		const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
		pointerX = ((event.clientX - box.left) / box.width) * 100;
		pointerY = ((event.clientY - box.top) / box.height) * 100;
	}
</script>

<section
	class="relative isolate min-h-screen overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8 dark:bg-void"
	onpointermove={track}
	aria-label="Introductory portfolio hero"
>
	<div
		class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(56,189,248,0.32),transparent_28%),linear-gradient(135deg,#eef7ff_0%,#dbeafe_42%,#bfdbfe_100%)] dark:bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(56,189,248,0.24),transparent_28%),linear-gradient(135deg,#050b18_0%,#0b1d3a_48%,#102a54_100%)]"
		style={`--x:${pointerX}%; --y:${pointerY}%`}
	></div>
	<div class="absolute inset-x-0 top-24 -z-10 h-px bg-ink/10 dark:bg-white/10"></div>
	<div class="absolute left-1/2 top-16 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full border border-ink/10 dark:border-white/10"></div>
	<div
		class="absolute right-4 top-32 hidden h-64 w-64 rounded-full border border-dashed border-ink/15 animate-[orbit_26s_linear_infinite] dark:border-white/15 lg:block"
	></div>

	<div class="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
		<div class="max-w-3xl">
			<div
				in:fly={{ y: 18, duration: 520 }}
				class="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-ink/70 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-mist/70"
			>
				<span class="relative flex size-2">
					<span class="absolute inline-flex size-full animate-[pulse-ring_1.6s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-seaglass"></span>
					<span class="relative inline-flex size-2 rounded-full bg-seaglass"></span>
				</span>
				Available for product teams
			</div>

			<h1
				in:fly={{ y: 26, duration: 700, delay: 80 }}
				class="mt-6 text-5xl font-black leading-[0.95] text-ink sm:text-7xl lg:text-8xl dark:text-mist"
			>
				{profile.name}
				<span class="block text-3xl text-sky-600 sm:text-5xl lg:text-6xl dark:text-limebeam">
					{profile.role}
				</span>
			</h1>
			<p
				in:fly={{ y: 24, duration: 680, delay: 160 }}
				class="mt-6 max-w-2xl text-lg leading-8 text-ink/72 sm:text-xl dark:text-mist/72"
			>
				{profile.tagline}
			</p>

			<div in:fly={{ y: 22, duration: 640, delay: 240 }} class="mt-8 flex flex-wrap gap-3">
				<a
					href="#projects"
					class="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-mist shadow-soft transition hover:-translate-y-1 dark:bg-limebeam dark:text-ink"
				>
					Explore projects <ArrowRight size={17} aria-hidden="true" />
				</a>
				<a
					href={`mailto:${profile.email}`}
					class="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/60 px-5 py-3 text-sm font-black text-ink backdrop-blur transition hover:-translate-y-1 dark:border-white/15 dark:bg-white/10 dark:text-mist"
				>
					Start a conversation <Mail size={17} aria-hidden="true" />
				</a>
			</div>

			<div class="mt-8 flex flex-wrap items-center gap-3" aria-label="Social links">
				<a
					class="grid size-11 place-items-center rounded-full border border-ink/10 bg-white/55 text-ink transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/10 dark:text-mist"
					href={profile.socials[0].href}
					aria-label="GitHub profile"
				>
					<Code2 size={19} aria-hidden="true" />
				</a>
				<a
					class="grid size-11 place-items-center rounded-full border border-ink/10 bg-white/55 text-ink transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/10 dark:text-mist"
					href={profile.socials[1].href}
					aria-label="LinkedIn profile"
				>
					<BriefcaseBusiness size={19} aria-hidden="true" />
				</a>
				<a
					class="grid size-11 place-items-center rounded-full border border-ink/10 bg-white/55 text-ink transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/10 dark:text-mist"
					href={`mailto:${profile.email}`}
					aria-label="Email Augustine"
				>
					<Mail size={19} aria-hidden="true" />
				</a>
			</div>
		</div>

		<div
			in:scale={{ start: 0.96, duration: 680, delay: 120 }}
			class="relative mx-auto w-full max-w-xl lg:max-w-none"
			aria-label="Interactive developer cockpit preview"
		>
			<div class="absolute -inset-6 rounded-[2.5rem] bg-white/35 blur-3xl dark:bg-seaglass/10"></div>
			<div
				class="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-ink p-3 shadow-soft dark:border-white/10 dark:bg-white/10"
			>
				<div class="flex items-center gap-2 border-b border-white/10 px-2 pb-3">
					<span class="size-3 rounded-full bg-coral"></span>
					<span class="size-3 rounded-full bg-voltage"></span>
					<span class="size-3 rounded-full bg-seaglass"></span>
					<span class="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-mist/70">
						live-system.svelte
					</span>
				</div>
				<div class="grid gap-3 pt-3 sm:grid-cols-[0.8fr_1.2fr]">
					<div class="rounded-3xl bg-white/7 p-4">
						<p class="text-xs font-bold uppercase tracking-[0.18em] text-limebeam">Signal</p>
						<div class="mt-4 grid gap-3">
							{#each ['motion', 'state', 'a11y', 'speed'] as row, index}
								<div class="flex items-center gap-3">
									<span class="w-14 text-xs font-bold text-mist/55">{row}</span>
									<span class="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
										<span
											class="block h-full rounded-full bg-gradient-to-r from-seaglass to-limebeam"
											style={`width:${72 + index * 7}%`}
										></span>
									</span>
								</div>
							{/each}
						</div>
					</div>
					<div class="relative min-h-80 overflow-hidden rounded-3xl bg-mist p-4 dark:bg-void">
						<div class="absolute inset-x-0 top-0 h-16 animate-[scanline_5s_linear_infinite] bg-gradient-to-b from-limebeam/25 to-transparent"></div>
						<div class="grid grid-cols-2 gap-3">
							{#each skills.slice(0, 8) as skill, index}
								<div
									class="rounded-2xl border border-ink/10 bg-white/70 p-3 text-xs font-black text-ink shadow-sm transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/10 dark:text-mist"
									style={`animation: float-panel ${5 + index * 0.28}s ease-in-out infinite; animation-delay:${index * 0.12}s`}
								>
									{skill}
								</div>
							{/each}
						</div>
						<div class="absolute bottom-4 left-4 right-4 rounded-2xl bg-ink p-4 text-mist dark:bg-limebeam dark:text-ink">
							<div class="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
								<MousePointer2 size={15} aria-hidden="true" />
								Cursor-reactive hero
							</div>
							<p class="mt-2 text-sm font-semibold opacity-75">
								Move around the viewport to bend the light field.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
