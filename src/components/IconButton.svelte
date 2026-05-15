<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, label, ariaExpanded, ariaControls, onclick } = $props<{
		children: Snippet;
		label: string;
		ariaExpanded?: boolean;
		ariaControls?: string;
		onclick?: (e: MouseEvent) => void;
	}>();
</script>

<button
	type="button"
	aria-label={label}
	class="icon-button"
	aria-expanded={ariaExpanded}
	aria-controls={ariaControls}
	{onclick}
>
	<div class="icon">
		{@render children()}
	</div>
</button>

<style>
	.icon-button {
		border-radius: 10px;
		padding: 8px;
		border: 1px solid var(--mdf-color-border-muted);
		background-color: var(--mdf-color-background-muted);
		box-shadow: 0px 1px 1px var(--mdf-color-border-default);
		cursor: pointer;
		color: inherit;

		.icon {
			display: flex;
			width: 1rem;
			height: 1rem;
		}

		&:hover,
		&:active {
			background-color: var(--mdf-color-background-default);
		}

		&:focus-visible {
			background-color: var(--mdf-color-background-default);
			box-shadow: 0px 0px 2px var(--mdf-color-border-default);
			outline: 2px solid var(--mdf-color-outline-default);
			outline-offset: 2px;
		}
	}
</style>
