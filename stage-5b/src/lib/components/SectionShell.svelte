<script lang="ts">
	let {
		id,
		kicker,
		title,
		description,
		class: className = '',
		children
	}: {
		id: string;
		kicker: string;
		title: string;
		description: string;
		class?: string;
		children: import('svelte').Snippet;
	} = $props();
</script>

<section {id} class={`px-4 py-16 sm:px-6 sm:py-24 lg:px-8 ${className}`}>
	<div class="mx-auto max-w-7xl">
		<div class="max-w-3xl">
			<p class="text-sm font-bold uppercase tracking-[0.24em] text-sky-600 dark:text-limebeam">
				{kicker}
			</p>
			<h2 class="mt-3 text-3xl font-black text-ink sm:text-5xl dark:text-mist">{title}</h2>
			<p class="mt-4 text-base leading-8 text-ink/70 sm:text-lg dark:text-mist/70">{description}</p>
		</div>
		<div class="mt-10">
			{@render children()}
		</div>
	</div>
</section>
