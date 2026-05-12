export type JSONDesignToken = {
	$value: unknown;
	$type?: string;
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
