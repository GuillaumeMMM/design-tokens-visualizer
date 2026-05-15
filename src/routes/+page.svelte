<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		type Node,
		type Edge
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import TokenNode from '../components/TokenNode.svelte';
	import { flattenDTCGTokens } from '../utils/flattenDTCGTokens';
	import type { DesignToken, JSONDesignToken } from '../types/DesignTokens';
	import Sidebar from '../components/Sidebar.svelte';
	import type { TokenError } from '../types/TokenError';
	import { isLocalStorageAvailable } from '../utils/isLocalStorageAvailable';

	let tokensStr = $state<string | null>(null);
	let nodes = $state.raw<Node[]>([]);
	let edges = $state.raw<Edge[]>([]);
	let errors = $state.raw<TokenError[]>([]);

	if (isLocalStorageAvailable()) {
		const tokensInLS = localStorage.getItem('design_tokens') || null;
		if (tokensInLS) {
			tokensChanged(tokensInLS);
		}
	}

	function tokensChanged(newTokensStr: string | null) {
		tokensStr = newTokensStr;
		if (isLocalStorageAvailable()) {
			localStorage.setItem('design_tokens', tokensStr || '');
		}
		if (!newTokensStr) {
			nodes = [];
			edges = [];
			errors = [{ type: 'EMPTY' }];
			return;
		}

		let tokensJson = {};

		try {
			tokensJson = JSON.parse(newTokensStr);
		} catch (e) {
			nodes = [];
			edges = [];
			errors = [{ type: 'INVALID_JSON' }];
			return;
		}

		const { tokens: flattenTokens, errors: flattenErrors } = flattenDTCGTokens(tokensJson);

		const tokenNodes: Map<string, DesignToken & { childrenKeys?: string[] }> = new Map();

		flattenTokens
			.filter((t) => t.$value !== undefined)
			.forEach((t) => {
				tokenNodes.set(t.key, { ...t, childrenKeys: [] });
			});

		flattenTokens
			.filter((t) => typeof t.$value === 'string' && t.$value.startsWith('{'))
			.forEach((t) => {
				if (typeof t.$value !== 'string') {
					return;
				}
				const match = tokenNodes.get(t.$value.substring(1, t.$value.length - 1));

				if (match) {
					tokenNodes.set(match.key, {
						...match,
						childrenKeys: (match.childrenKeys || []).concat(t.key)
					});
				} else {
					flattenErrors.push({ type: 'INEXISTANT_REF', token: t });
				}
			});

		const flowNodes: Node[] = [];
		const levelXOffset = 500;
		const levelYOffset = 150;

		let globalYCounter = 0;

		Array.from(tokenNodes.values())
			.filter((n) => typeof n.$value !== 'string' || !n.$value.startsWith('{'))
			.forEach((token) => {
				addTokenAndChildren(token, 0, undefined, false);
			});

		function addTokenAndChildren(
			token: JSONDesignToken & { key: string } & { childrenKeys?: string[] },
			levelX: number,
			rootToken: (JSONDesignToken & { key: string } & { childrenKeys?: string[] }) | undefined,
			isLastChild: boolean
		): void {
			const currentY = globalYCounter;

			flowNodes.push({
				id: token.key,
				position: {
					x: levelX * levelXOffset,
					y: currentY * levelYOffset
				},
				deletable: false,
				data: { token, rootToken: rootToken },
				type: 'tokenNode'
			});

			(token.childrenKeys || []).forEach((key, i, self) => {
				addTokenAndChildren(
					tokenNodes.get(key)!,
					levelX + 1,
					levelX === 0 ? token : rootToken,
					self.length - 1 === i
				);
			});

			if (!isLastChild) {
				globalYCounter++;
			}
		}

		nodes = flowNodes;

		const flowEdges: Edge[] = [];

		for (const flowNode of tokenNodes) {
			(flowNode[1].childrenKeys || []).forEach((key: string) => {
				flowEdges.push({
					id: `${flowNode[0]}-${key}`,
					source: flowNode[0],
					target: key,
					deletable: false,
					selectable: false
				});
			});
		}

		edges = flowEdges;
		errors = flattenErrors;
	}

	const nodeTypes = { tokenNode: TokenNode };
</script>

<div class="container">
	<div class="sidebar">
		<Sidebar {tokensChanged} {tokensStr} {errors} {nodes}></Sidebar>
	</div>
	<SvelteFlow
		{nodes}
		{edges}
		minZoom={0}
		initialViewport={{ zoom: 0.5, x: 200, y: 100 }}
		proOptions={{ hideAttribution: true }}
		{nodeTypes}
	>
		<Controls showLock={false} position={'bottom-right'} />
		<Background variant={BackgroundVariant.Dots} gap={50} size={4} />
	</SvelteFlow>
</div>

<style>
	.container {
		width: 100%;
		height: 100vh;
		position: relative;
	}

	.sidebar {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
	}

	:global {
		.svelte-flow {
			--background-color: var(--mdf-color-background-default);
			--xy-controls-button-background-color-hover-default: var(--mdf-color-background-default);
			--xy-controls-button-border-color-default: var(--mdf-color-border-default);
			--xy-edge-stroke-width-default: 2px;
			--xy-edge-stroke-default: var(--mdf-color-border-default);
			--xy-handle-border-color-default: var(--mdf-color-border-default);
			--xy-handle-background-color-default: var(--mdf-color-background-muted);
			--xy-background-pattern-color-props: var(--mdf-color-border-default);

			.svelte-flow__handle {
				width: 10px;
				height: 10px;
				border-width: 1px;
			}

			.svelte-flow__controls {
				gap: 8px;
				box-shadow: none;

				button {
					border-radius: 10px;
					width: 34px;
					height: 34px;
					padding: 8px;
					border: 1px solid var(--mdf-color-border-muted);
					background-color: var(--mdf-color-background-muted);
					box-shadow: 0px 1px 1px var(--mdf-color-border-default);
					cursor: pointer;

					svg {
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
			}
		}

		textarea::-webkit-resizer {
			background-image: url("data:image/svg+xml,<svg id='icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' aria-hidden='true'><polygon points='10 26 10 24 22.59 24 6 7.41 7.41 6 24 22.59 24 10 26 10 26 26 10 26' fill='rgb(51, 51, 51)' stroke-width='2px' stroke='rgb(101, 101, 101)'/></svg>");
			background-repeat: no-repeat;
			background-position: center;
			background-size: 12px;
		}

		html[data-theme='dark'] {
			textarea::-webkit-resizer {
				display: none;
				background-image: url("data:image/svg+xml,<svg id='icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' aria-hidden='true'><polygon points='10 26 10 24 22.59 24 6 7.41 7.41 6 24 22.59 24 10 26 10 26 26 10 26' fill='rgb(51, 51, 51)' stroke-width='2px' stroke='rgb(201, 201, 201)'/></svg>");
			}
		}
	}
</style>
