<script lang="ts">
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	@import '@guillaumemmm/marquedefabrique/dist/css/kit.css';
	@import '@guillaumemmm/marquedefabrique/dist/css/reset.css';
	@import '@guillaumemmm/marquedefabrique/dist/css/variables.css';

	:global {
		body {
			font-family: ui-monospace, Menlo, Consolas, 'Courier New', monospace;
		}
	}
</style>
