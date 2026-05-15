<script lang="ts">
	import { Send, Terminal } from '@lucide/svelte';
	import SectionShell from './SectionShell.svelte';
	import { profile, projects, skills } from '$lib/data/portfolio';

	const commands: Record<string, string> = {
		help: 'Commands: projects, skills, contact, resume, clear',
		projects: projects.map((project) => `${project.title} -> /projects/${project.slug}`).join('\n'),
		skills: skills.join(' | '),
		contact: `Email ${profile.email} or jump to #contact`,
		resume: `Resume path: ${profile.resumeUrl}`
	};

	let input = $state('');
	let history = $state([
		{ command: 'boot', output: 'Portfolio interface online. Type help to explore.' }
	]);

	function sanitize(value: string) {
		return value.replace(/[<>]/g, '').trim().slice(0, 80);
	}

	function runCommand() {
		const command = sanitize(input).toLowerCase();
		if (!command) return;
		if (command === 'clear') {
			history = [];
			input = '';
			return;
		}
		history = [
			...history,
			{
				command,
				output: commands[command] ?? `Unknown command "${command}". Try help.`
			}
		].slice(-8);
		input = '';
	}
</script>

<SectionShell
	id="terminal"
	kicker="Creative feature"
	title="Developer tools experience"
	description="A terminal-inspired interface provides a second navigation model, sanitizes user input, and keeps command output bounded."
>
	<div class="overflow-hidden rounded-[1.7rem] border border-ink/10 bg-ink shadow-soft dark:border-white/10">
		<div class="flex items-center gap-3 border-b border-white/10 px-5 py-4">
			<span class="size-3 rounded-full bg-yellow-400"></span>
			<span class="size-3 rounded-full bg-red-500"></span>
			<span class="size-3 rounded-full bg-green-500"></span>
			<Terminal class="text-limebeam" size={20} aria-hidden="true" />
			<p class="text-sm font-black text-mist">augustine.dev terminal</p>
			<p class="ml-auto text-xs font-bold text-mist/45">input sanitized</p>
		</div>
		<div class="min-h-80 space-y-5 p-5 font-mono text-sm">
			{#each history as item}
				<div>
					<p class="text-limebeam">~/portfolio $ {item.command}</p>
					<pre class="mt-2 whitespace-pre-wrap leading-7 text-mist/75">{item.output}</pre>
				</div>
			{/each}
		</div>
		<form class="border-t border-white/10 p-3" onsubmit={(event) => { event.preventDefault(); runCommand(); }}>
			<label class="sr-only" for="terminal-input">Terminal command</label>
			<div class="relative">
				<input
					id="terminal-input"
					class="w-full rounded-full border border-white/10 bg-white/8 py-3 pl-4 pr-16 font-mono text-sm text-mist outline-none placeholder:text-mist/35 focus:border-limebeam"
					bind:value={input}
					placeholder="Try help, projects, skills..."
					autocomplete="off"
				/>
				<button
					type="submit"
					class="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-limebeam text-ink transition hover:scale-105"
					aria-label="Run command"
				>
					<Send size={17} aria-hidden="true" />
				</button>
			</div>
		</form>
	</div>
</SectionShell>
