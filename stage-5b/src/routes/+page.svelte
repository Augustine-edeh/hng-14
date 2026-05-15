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
	<title>Augustine Chukwu | Interactive Svelte Developer Portfolio</title>
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

<footer class="bg-ink px-4 py-8 text-mist sm:px-6 lg:px-8 dark:bg-black">
	<div class="mx-auto flex max-w-7xl flex-col gap-3 text-sm font-semibold text-mist/60 sm:flex-row sm:items-center sm:justify-between">
		<p>Built with SvelteKit, Svelte 5, and TailwindCSS.</p>
		<p>Performance-minded, keyboard-friendly, motion-aware.</p>
	</div>
</footer>
