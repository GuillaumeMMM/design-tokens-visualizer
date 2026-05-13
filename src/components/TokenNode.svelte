<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	import type { DesignToken } from '../types/DesignTokens';
	import ColorToken from './token-types/ColorToken.svelte';
	import UnknownToken from './token-types/UnknownToken.svelte';
	import NumberToken from './token-types/NumberToken.svelte';
	import ObjectToken from './token-types/ObjectToken.svelte';

	let { data, id } = $props<{
		data: { token: DesignToken; rootToken?: DesignToken };
		id: string;
	}>();
	const isRoot = $derived(!Boolean(data.rootToken));
	const isLeaf = $derived(!data.token.childrenKeys);
	const label = $derived(id.replace('{', '').replace('}', ''));

	const tokenType = $derived(data.token.$type);
	const tokenValue = $derived<DesignToken['$value']>(
		isRoot ? data.token.$value : data.rootToken.$value
	);
</script>

<div class="token-node">
	<div class={`token-node-box ${isLeaf ? 'leaf' : ''} ${isRoot ? 'root' : ''}`}>
		<div class="token-node-left">
			{#if tokenType === 'color'}
				<ColorToken {tokenValue}></ColorToken>
			{:else if tokenType === 'number' || typeof tokenValue === 'number'}
				<NumberToken></NumberToken>
			{:else if typeof tokenValue === 'object'}
				<ObjectToken></ObjectToken>
			{:else if !tokenType}
				<UnknownToken></UnknownToken>
			{/if}
		</div>
		<div class="token-node-right">
			<div class="token-node-label">{label}</div>
			{#if isRoot}
				<div class="token-node-value">{data.token.$value}</div>
			{/if}
		</div>
	</div>
	{#if !isRoot}
		<Handle type="target" position={Position.Left} />
	{/if}
	{#if (data.token.childrenKeys || []).length > 0}
		<Handle type="source" position={Position.Right} />
	{/if}
</div>

<style>
	.token-node-box {
		border-radius: 12px;
		border: 1px solid var(--mdf-color-border-default);
		box-shadow: 1px 1px 4px rgba(46, 46, 46, 0.596);
		display: flex;
		max-width: 450px;
		word-break: break-all;
		line-height: 1.4rem;
		color: var(--mdf-color-text-default);

		&.leaf {
			max-width: fit-content;
		}

		.token-node-right {
			background-color: var(--mdf-color-background-default);
			flex: 1;
			border-bottom-right-radius: 10px;
			border-top-right-radius: 10px;
			border-left: 1px solid var(--mdf-color-border-default);
		}

		.token-node-left {
			width: 40px;
		}

		&.root .token-node-left {
			width: 60px;
		}

		.token-node-label,
		.token-node-value {
			padding: 12px 20px;
		}

		.token-node-value {
			border-top: 1px solid var(--mdf-color-border-muted);
		}
	}
</style>
