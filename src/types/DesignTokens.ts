type TokenType =
	| 'color'
	| 'dimension'
	| 'fontFamily'
	| 'fontWeight'
	| 'duration'
	| 'cubicBezier'
	| 'number';

export type JSONDesignToken = {
	$value: unknown;
	$type?: TokenType;
	$deprecated?: boolean | string;
	$description?: string;
	$extensions?: Object;
};

export type JSONDesignTokens =
	| JSONDesignToken
	| {
			[key: string]: JSONDesignToken | JSONDesignTokens;
	  };

export type DesignToken = JSONDesignToken & {
	key: string;
};
