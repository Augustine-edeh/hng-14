<script lang="ts">
	import { CheckCircle2, Mail, ShieldCheck } from '@lucide/svelte';
	import SectionShell from './SectionShell.svelte';
	import { profile } from '$lib/data/portfolio';

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let status = $state<'idle' | 'error' | 'success'>('idle');
	let error = $state('');

	function sanitize(value: string, max = 500) {
		return value.replace(/[<>]/g, '').trim().slice(0, max);
	}

	function submit() {
		const safeName = sanitize(name, 80);
		const safeEmail = sanitize(email, 120);
		const safeMessage = sanitize(message, 700);
		if (!safeName || !safeMessage || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
			status = 'error';
			error = 'Please add a valid name, email, and message.';
			return;
		}
		const subject = encodeURIComponent(`Portfolio inquiry from ${safeName}`);
		const body = encodeURIComponent(`${safeMessage}\n\nFrom: ${safeName} <${safeEmail}>`);
		window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
		status = 'success';
		error = '';
	}
</script>

<SectionShell
	id="contact"
	kicker="Contact"
	title="A calm path from interest to conversation"
	description="The form validates locally, strips angle brackets, and falls back to mailto so no secret keys or server credentials are exposed."
>
	<div class="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
		<div class="rounded-[1.6rem] bg-ink p-6 text-mist shadow-soft dark:bg-white/7">
			<Mail class="text-limebeam" size={28} aria-hidden="true" />
			<h3 class="mt-5 text-2xl font-black">Let’s build something sharp.</h3>
			<p class="mt-3 leading-7 text-mist/68">
				I’m strongest where frontend craft, product strategy, and performance budgets meet.
			</p>
			<a class="mt-6 inline-flex rounded-full bg-limebeam px-5 py-3 text-sm font-black text-ink" href={`mailto:${profile.email}`}>
				{profile.email}
			</a>
			<div class="mt-8 flex items-center gap-3 rounded-3xl bg-white/8 p-4">
				<ShieldCheck class="text-seaglass" size={22} aria-hidden="true" />
				<p class="text-sm font-semibold text-mist/72">No exposed secrets, no hidden third-party form endpoint.</p>
			</div>
		</div>

		<form
			class="grid gap-4 rounded-[1.6rem] border border-ink/10 bg-white/75 p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
			onsubmit={(event) => {
				event.preventDefault();
				submit();
			}}
		>
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="grid gap-2 text-sm font-black text-ink dark:text-mist">
					Name
					<input
						class="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-semibold text-ink outline-none transition focus:border-sky-600 dark:border-white/10 dark:bg-void dark:text-mist"
						bind:value={name}
						autocomplete="name"
						maxlength="80"
						required
					/>
				</label>
				<label class="grid gap-2 text-sm font-black text-ink dark:text-mist">
					Email
					<input
						class="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-semibold text-ink outline-none transition focus:border-sky-600 dark:border-white/10 dark:bg-void dark:text-mist"
						bind:value={email}
						type="email"
						autocomplete="email"
						maxlength="120"
						required
					/>
				</label>
			</div>
			<label class="grid gap-2 text-sm font-black text-ink dark:text-mist">
				Message
				<textarea
					class="min-h-40 resize-y rounded-2xl border border-ink/10 bg-white px-4 py-3 font-semibold text-ink outline-none transition focus:border-sky-600 dark:border-white/10 dark:bg-void dark:text-mist"
					bind:value={message}
					maxlength="700"
					required
				></textarea>
			</label>
			{#if status === 'error'}
				<p class="rounded-2xl bg-coral/12 px-4 py-3 text-sm font-bold text-red-800 dark:text-red-200" role="alert">
					{error}
				</p>
			{/if}
			{#if status === 'success'}
				<p class="flex items-center gap-2 rounded-2xl bg-seaglass/14 px-4 py-3 text-sm font-bold text-blue-950 dark:text-seaglass" role="status">
					<CheckCircle2 size={17} aria-hidden="true" /> Mail app opened with a sanitized draft.
				</p>
			{/if}
			<button
				type="submit"
				class="rounded-full bg-ink px-6 py-4 text-sm font-black text-mist transition hover:-translate-y-1 dark:bg-limebeam dark:text-ink"
			>
				Send message
			</button>
		</form>
	</div>
</SectionShell>
