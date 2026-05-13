<script lang="ts">
	import SigmaIcon from '../icons/SigmaIcon.svelte';
	import TreeIcon from '../icons/TreeIcon.svelte';
</script>

<div class="number-token">
	<TreeIcon></TreeIcon>
</div>

<style>
	.number-token {
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--mdf-color-background-default);
	}
</style>
