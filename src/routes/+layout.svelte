<script lang="ts">
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Design tokens visualizer</title>
	<meta
		name="description"
		content="Graph visualizaton tool for design tokens following the DTCG (Design Tokens Community Group) format."
	/>
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
