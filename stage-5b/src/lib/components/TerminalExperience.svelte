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
		<form class="flex gap-2 border-t border-white/10 p-3" onsubmit={(event) => { event.preventDefault(); runCommand(); }}>
			<label class="sr-only" for="terminal-input">Terminal command</label>
			<input
				id="terminal-input"
				class="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 font-mono text-sm text-mist outline-none placeholder:text-mist/35 focus:border-limebeam"
				bind:value={input}
				placeholder="Try help, projects, skills..."
				autocomplete="off"
			/>
			<button
				type="submit"
				class="grid size-12 place-items-center rounded-2xl bg-limebeam text-ink transition hover:-translate-y-0.5"
				aria-label="Run command"
			>
				<Send size={18} aria-hidden="true" />
			</button>
		</form>
	</div>
</SectionShell>
