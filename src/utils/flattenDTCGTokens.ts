import type { DesignToken, JSONDesignToken, JSONDesignTokens } from '../types/DesignTokens';

function isPlainObject(value: any) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return (
		(prototype === null ||
			prototype === Object.prototype ||
			Object.getPrototypeOf(prototype) === null) &&
		!(Symbol.toStringTag in value) &&
		!(Symbol.iterator in value)
	);
}

function _flattenTokens(
	slice: JSONDesignTokens | JSONDesignToken,
	result: DesignToken[] = [],
	keyMemo: string[] = []
): DesignToken[] {
	for (let key in slice) {
		if (!Object.hasOwn(slice, key)) {
			continue;
		}

		const sliceValue = slice[key as keyof JSONDesignTokens | keyof JSONDesignToken];
		const isPlainObj = isPlainObject(sliceValue);

		if (!isPlainObj) {
			continue;
		}

		if (sliceValue && typeof sliceValue === 'object' && Object.hasOwn(sliceValue, '$value')) {
			result.push({
				...(sliceValue as JSONDesignToken),
				key: `{${[...keyMemo, key].join('.')}}`
			});
		} else {
			_flattenTokens(sliceValue as JSONDesignTokens | JSONDesignToken, result, keyMemo.concat(key));
		}
	}
	return result;
}

export function flattenDTCGTokens(tokens: JSONDesignTokens) {
	return _flattenTokens(tokens);
}
