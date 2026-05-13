<script lang="ts">
	import type { Node } from '@xyflow/svelte';
	import type { TokenError } from '../types/TokenError';
	import SidebarConsole from './SidebarConsole.svelte';
	import { isLocalStorageAvailable } from '../utils/isLocalStorageAvailable';

	const { tokensChanged, tokensStr, errors, nodes } = $props<{
		tokensStr: string | null;
		errors: TokenError[];
		tokensChanged: (token: string | null) => void;
		nodes: Node[];
		tokensTextareaDimensions: { width: number; height: number };
	}>();

	let isOpen = $state<boolean>(true);

	const textareaDimensionsStr = isLocalStorageAvailable()
		? localStorage.getItem('textarea-dim')
		: null;

	let textareaDimensions = $state(
		textareaDimensionsStr ? JSON.parse(textareaDimensionsStr) : { width: 0, height: 0 }
	);

	function onTokensChange(e: Event) {
		const inputTokens = (e.target as HTMLInputElement).value;
		tokensChanged(inputTokens);
	}

	function observeResize(el: HTMLElement) {
		const ro = new ResizeObserver(([entry]) => {
			if (isLocalStorageAvailable()) {
				localStorage.setItem(
					'textarea-dim',
					JSON.stringify({
						width: entry.contentRect.width,
						height: entry.contentRect.height
					})
				);
			}
		});
		ro.observe(el);
		return { destroy: () => ro.disconnect() };
	}
</script>

<div class={`sidebar ${isOpen ? 'open' : 'closed'}`}>
	<div class="sidebar-panel">
		<div class="sidebar-header">
			<h1>Tokens visualizer</h1>
			<button
				type="button"
				class="mdf-button"
				aria-expanded={isOpen}
				aria-controls="sidebar-content"
				onclick={() => {
					isOpen = !isOpen;
				}}>{isOpen ? 'close' : 'open'}</button
			>
		</div>
		{#if isOpen}
			<div class="sidebar-tokens" id="sidebar-content">
				<label class="mdf-textarea" for="tokens">
					<div class="mdf-textarea-label">Tokens</div>
					<textarea
						class="mdf-textarea-field tokens-textarea"
						id="tokens"
						value={tokensStr}
						oninput={onTokensChange}
						style:width={`${textareaDimensions.width}px`}
						style:height={`${textareaDimensions.height}px`}
						use:observeResize
					></textarea>
				</label>
			</div>
			<div class="expandable-section">
				<details class="details">
					<summary class="summary">Tokens ({nodes.length})</summary>
					<ul>
						{#each nodes as node}
							<li>{(node as Node).id}</li>
						{/each}
					</ul>
				</details>
			</div>
			<div class="expandable-section">
				<details class="details">
					<summary class="summary">Errors ({errors.length})</summary>
					<SidebarConsole {errors}></SidebarConsole>
				</details>
			</div>
		{/if}
	</div>
</div>

<style>
	.sidebar {
		height: 100%;
		padding: 1rem;
		max-width: 100vw;

		.sidebar-panel {
			background-color: var(--mdf-color-background-default);
			border-radius: 10px;
			box-shadow: 1px 1px 3px rgba(109, 109, 109, 0.365);
			max-height: 100%;
			overflow-y: auto;
		}

		.sidebar-header {
			padding: 1rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			position: sticky;
			top: 0;
			background-color: var(--mdf-color-background-default);
		}

		.sidebar-tokens {
			padding: 1rem;
		}

		&.open .sidebar-header {
			border-bottom: 1px solid var(--mdf-color-border-default);
		}
	}

	.tokens-textarea {
		min-width: 200px;
		white-space: nowrap;
		font-size: 0.8rem;
		line-height: 1rem;
		max-height: 75vh;
		max-width: 100%;
	}

	.expandable-section {
		background-color: var(--mdf-color-background-muted);

		.summary {
			padding: 1rem;
			cursor: pointer;

			&:hover {
				background-color: var(--mdf-color-background-default);
			}
		}
	}
</style>
