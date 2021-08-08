import process from 'process';

const prefix = '@discoin/scambio: Assertion failed';

/**
 * Throws an errror if `condition` is falsy.
 * @private
 * @param condition The condition to check
 * @param message The error message to display in development builds
 */
export function invariant(condition: unknown, message?: string): asserts condition {
	if (!condition) {
		const error = process.env.NODE_ENV === '' ? new Error(`${prefix}: ${message ?? ''}`) : new Error(prefix);
		throw error;
	}
}
