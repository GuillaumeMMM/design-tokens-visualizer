<script lang="ts">
	import type { DesignToken } from '../../types/DesignTokens';

	let props = $props<{ token: DesignToken; isRoot: boolean; rootToken?: DesignToken }>();
</script>

<div
	class={`color-token ${props.isRoot ? 'root' : ''}`}
	style:background-color={props.isRoot ? props.token.$value : props.rootToken.$value}
></div>

<style>
	.color-token {
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		width: 40px;
		height: 100%;
	}

	.root {
		width: 60px;
	}
</style>
