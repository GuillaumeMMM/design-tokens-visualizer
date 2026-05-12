import type { DesignToken } from './DesignTokens';

export type TokenErrorType = 'MISSING_TYPE' | 'EMPTY' | 'INVALID_JSON';

export type TokenError = {
	token?: DesignToken;
	type: TokenErrorType;
};
