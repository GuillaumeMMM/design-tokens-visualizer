<script lang="ts">
	import type { DesignToken } from '../../types/DesignTokens';

	let { tokenValue } = $props<{ tokenValue: DesignToken['$value'] }>();
</script>

<div class="color-token" style:background-color={tokenValue}></div>

<style>
	.color-token {
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		width: 100%;
		height: 100%;
	}
</style>
