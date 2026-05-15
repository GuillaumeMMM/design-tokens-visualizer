<script lang="ts">
	import type { Node } from '@xyflow/svelte';
	import type { TokenError } from '../types/TokenError';
	import SidebarConsole from './SidebarConsole.svelte';
	import { isLocalStorageAvailable } from '../utils/isLocalStorageAvailable';
	import IconButton from './IconButton.svelte';
	import OpenPanelIcon from './icons/OpenPanelIcon.svelte';
	import Logo from './icons/Logo.svelte';
	import ClosePanelIcon from './icons/ClosePanelIcon.svelte';

	const { tokensChanged, tokensStr, errors, nodes } = $props<{
		tokensStr: string | null;
		errors: TokenError[];
		tokensChanged: (token: string | null) => void;
		nodes: Node[];
	}>();

	let isOpen = $state<boolean>(
		isLocalStorageAvailable()
			? localStorage.getItem('textarea-opened') === ''
				? false
				: true
			: true
	);

	function getStoredDimensions() {
		if (!isLocalStorageAvailable()) return { width: 500, height: 300 };
		const stored = localStorage.getItem('textarea-dim');
		return stored ? JSON.parse(stored) : { width: 500, height: 300 };
	}

	function onTokensChange(e: Event) {
		const inputTokens = (e.target as HTMLInputElement).value;
		tokensChanged(inputTokens);
	}

	function toggleSidebar() {
		isOpen = !isOpen;
		localStorage.setItem('textarea-opened', isOpen ? '1' : '');
	}

	function observeResize(el: HTMLElement) {
		const ro = new ResizeObserver(([entry]) => {
			if (isLocalStorageAvailable()) {
				const newDims = {
					width: entry.contentRect.width,
					height: entry.contentRect.height
				};
				localStorage.setItem('textarea-dim', JSON.stringify(newDims));
			}
		});
		ro.observe(el);
		return { destroy: () => ro.disconnect() };
	}
</script>

<div class={`sidebar ${isOpen ? 'open' : 'closed'}`}>
	<div class="sidebar-panel">
		<div class="sidebar-header">
			<div class="left">
				<div class="logo"><Logo></Logo></div>
				<h1 class="title">Tokens Visualizer</h1>
			</div>
			<IconButton
				ariaExpanded={isOpen}
				ariaControls="sidebar-content"
				label={isOpen ? 'Close the sidebar' : 'Open the sidebar'}
				onclick={toggleSidebar}
			>
				{#if isOpen}
					<ClosePanelIcon></ClosePanelIcon>
				{:else}
					<OpenPanelIcon></OpenPanelIcon>
				{/if}
			</IconButton>
		</div>
		{#if isOpen}
			{@const textareaDimensions = getStoredDimensions()}
			<div class="sidebar-tokens" id="sidebar-content">
				<label class="mdf-textarea" for="tokens">
					<div class="mdf-textarea-label textarea-label">Design tokens</div>
					<p class="textarea-description">
						Tokens must be a valid JSON, and follow the <a
							class="mdf-link link"
							href="https://www.designtokens.org/tr/2025.10/format/">DTCG format</a
						>.<br /><a
							class="mdf-link link"
							href="https://github.com/GuillaumeMMM/design-tokens-visualizer#todo">Read more</a
						> about what's currently supported.
					</p>
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
			{#if nodes.length > 0}
				<div class="expandable-section">
					<details class="details">
						<summary class="summary">Tokens ({nodes.length})</summary>
						<ul class="tokens">
							{#each nodes as node}
								<li class="mdf-block mdf-block-brand-primary token">{(node as Node).id}</li>
							{/each}
						</ul>
					</details>
				</div>
			{/if}
			{#if errors.length > 0}
				<div class="expandable-section">
					<details class="details">
						<summary class="summary">Errors ({errors.length})</summary>
						<SidebarConsole {errors}></SidebarConsole>
					</details>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.sidebar {
		height: 100%;
		padding: 1rem;
		max-width: 100vw;

		.sidebar-panel {
			box-shadow: 1px 1px 3px rgba(109, 109, 109, 0.365);
			max-height: calc(100vh - 2rem);
			overflow-y: auto;
			border-radius: 10px;
			background-color: var(--mdf-color-background-default);
		}

		.sidebar-header {
			padding: 1rem;
			border-radius: 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 2rem;
			position: sticky;
			top: -1rem;
			background-color: var(--mdf-color-background-default);

			.left {
				display: flex;
				align-items: center;
				gap: 5px;

				.logo {
					width: 34px;
					height: 34px;
				}

				.title {
					font-size: 0.8rem;
				}
			}
		}

		.sidebar-tokens {
			padding: 10px;
		}

		&.open .sidebar-header {
			border-bottom: 1px solid var(--mdf-color-border-default);
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}
	}

	.textarea-label {
		font-weight: 600;
		font-size: 0.8rem;
	}

	.textarea-description {
		display: block;
		margin: 5px 0;
		font-size: 0.6rem;
		color: var(--mdf-color-text-muted);
		line-height: 0.8rem;

		.link {
			padding: 2px 6px;
		}
	}

	.tokens-textarea {
		min-width: 200px;
		min-height: 150px;
		white-space: nowrap;
		font-size: 0.8rem;
		line-height: 1rem;
		max-width: 100%;

		&:focus-visible {
			outline: none;
			background-color: var(--mdf-color-background-default);
			border: 1px solid var(--mdf-color-border-default);
		}
	}

	.expandable-section {
		background-color: var(--mdf-color-background-muted);

		.summary {
			padding: 1rem;
			cursor: pointer;
			border-radius: 10px;

			&:hover {
				background-color: hsl(from var(--mdf-color-background-default) h s calc(l - 10));
			}
		}

		.tokens {
			display: flex;
			flex-direction: column;
			gap: 10px;
			padding: 10px;

			.token {
				word-break: break-all;
			}
		}
	}
</style>
