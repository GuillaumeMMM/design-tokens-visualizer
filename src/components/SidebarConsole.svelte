<script lang="ts">
	import type { TokenError, TokenErrorType } from '../types/TokenError';

	const { errors } = $props<{ errors: TokenError[] }>();

	const errorsDisplay: {
		[key in TokenErrorType]: { message: string; criticity: 'error' | 'warning' };
	} = {
		INVALID_JSON: {
			message: 'Invalid JSON format',
			criticity: 'error'
		},
		EMPTY: {
			message: 'No design tokens found',
			criticity: 'error'
		},
		MISSING_TYPE: {
			message: 'Token does not have a type',
			criticity: 'warning'
		}
	};
</script>

<div class="console">
	<ul class="console-errors">
		{#each errors as error}
			<li class="console-error">
				{errorsDisplay[(error as TokenError).type].criticity === 'error' ? '⛔ ' : '⚠️ '}
				{errorsDisplay[(error as TokenError).type].message}
			</li>
		{/each}
	</ul>
</div>

<style>
	.console {
		padding: 5px 0;
		.console-errors {
			display: flex;
			flex-direction: column;
			gap: 2px;

			.console-error {
				padding: 2px 5px;
			}
		}
	}
</style>
