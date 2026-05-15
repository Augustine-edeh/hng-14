<script lang="ts">
	import AppNav from '$lib/components/AppNav.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import ProjectsShowcase from '$lib/components/ProjectsShowcase.svelte';
	import SkillsOrbit from '$lib/components/SkillsOrbit.svelte';
	import TerminalExperience from '$lib/components/TerminalExperience.svelte';
	import TimelineSection from '$lib/components/TimelineSection.svelte';

	let commandOpen = $state(false);
</script>

<svelte:head>
	<title>Augustine Edeh | Interactive Svelte Developer Portfolio</title>
	<meta
		name="description"
		content="Interactive SvelteKit developer portfolio showcasing projects, frontend systems, animations, accessibility, and performance."
	/>
</svelte:head>

<AppNav onCommand={() => (commandOpen = true)} />
<CommandPalette open={commandOpen} onClose={() => (commandOpen = false)} />

<main id="main" class="bg-mist text-ink dark:bg-void dark:text-mist">
	<HeroSection />
	<ProjectsShowcase />
	<SkillsOrbit />
	<TerminalExperience />
	<TimelineSection />
	<ContactSection />
</main>


<footer
	class="border-t border-white/10 bg-ink dark:bg-black px-4 py-4 text-mist sm:px-6 lg:px-8"
>
	<div
		class="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
	>
		<!-- Left Content -->
		<p class="text-center">Built with SvelteKit, Svelte 5, & TailwindCSS.</p>			
	

		<!-- Right Content -->
		<div class="flex flex-col justify-center items-center gap-3 sm:items-end">
			<a
				href="https://augustineedeh.vercel.app/"
				target="_blank"
				rel="noopener noreferrer"
				class="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
			>
				<span>Augustine Edeh</span>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17.25 6.75h-10.5m10.5 0v10.5m0-10.5L6.75 17.25"
					/>
				</svg>
			</a>

			<p class="text-xs text-mist/40">
				© 2026 All rights reserved.
			</p>
		</div>
	</div>
</footer>
