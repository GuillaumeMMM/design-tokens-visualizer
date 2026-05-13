<script lang="ts">
	import ErrorIcon from '../icons/ErrorIcon.svelte';
</script>

<div class="unknown-token">
	<div class="icon"><ErrorIcon></ErrorIcon></div>
</div>

<style>
	.unknown-token {
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		--stripes-1: var(--mdf-color-background-default);
		--stripes-2: var(--mdf-color-background-subtle);
		background: repeating-linear-gradient(
			45deg,
			var(--stripes-1),
			var(--stripes-1) 10px,
			var(--stripes-2) 10px,
			var(--stripes-2) 20px
		);

		.icon {
			display: flex;
			width: 2rem;
		}
	}
</style>
