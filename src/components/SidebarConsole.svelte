<script lang="ts">
	import type { DesignToken } from '../types/DesignTokens';
	import type { TokenError, TokenErrorType } from '../types/TokenError';

	const { errors } = $props<{ errors: TokenError[] }>();

	const errorsDisplay: {
		[key in TokenErrorType]: {
			message: (token: DesignToken) => string;
			criticity: 'error' | 'warning';
		};
	} = {
		INVALID_JSON: {
			message: () => 'Invalid JSON format',
			criticity: 'error'
		},
		EMPTY: {
			message: () => 'No design tokens found',
			criticity: 'error'
		},
		MISSING_TYPE: {
			message: (token) => `Token ${token.key} does not have a type`,
			criticity: 'warning'
		},
		UNAUTHORIZED_KEY_STR: {
			message: (token) => `Token ${token.key} keys contain unauthorized characters`,
			criticity: 'error'
		},
		INEXISTANT_REF: {
			message: (token) => `Token ${token.key} references a token that does not exist`,
			criticity: 'warning'
		}
	};
</script>

<div class="console">
	<ul class="console-errors">
		{#each errors as error}
			<li class="console-error">
				{errorsDisplay[(error as TokenError).type].criticity === 'error' ? '⛔ ' : '⚠️ '}
				{errorsDisplay[(error as TokenError).type].message(error.token)}
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
