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

		console.log({ flattenErrors });

		const tokenNodes: Map<string, DesignToken & { childrenKeys?: string[] }> = new Map();

		flattenTokens
			.filter((t) => t.$value)
			.forEach((t) => {
				tokenNodes.set(t.key, { ...t, childrenKeys: [] });
			});

		flattenTokens
			.filter((t) => t.$value && typeof t.$value === 'string' && t.$value.startsWith('{'))
			.forEach((t) => {
				const match = tokenNodes.get(t.$value as string);

				if (match) {
					tokenNodes.set(match.key, {
						...match,
						childrenKeys: (match.childrenKeys || []).concat(t.key)
					});
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
		height: 100vh;
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
					color: var(--mdf-color-text-default);
					background-color: var(--mdf-color-background-subtle);
					border: none;
					border-radius: 8px;
					box-shadow: 0px 1px 3px rgb(213, 213, 213);

					&:focus-visible {
						outline: 2px solid var(--mdf-color-outline-default);
						outline-offset: 3px;
					}
				}
			}
		}
	}
</style>
