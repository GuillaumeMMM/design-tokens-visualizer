import type { DesignToken } from './DesignTokens';

export type TokenErrorType = 'MISSING_TYPE' | 'EMPTY' | 'INVALID_JSON' | 'UNAUTHORIZED_KEY_STR';

export type TokenError = {
	token?: DesignToken;
	type: TokenErrorType;
};
