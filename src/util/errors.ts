import {Response} from 'node-fetch';
import {APIErrorResponse} from '../types/api';

/**
 * Create a Node.js `Error` object from a Discoin API response.
 * @param apiError The API error response to use
 * @returns The error object
 */
export function apiErrorFactory(apiError: APIErrorResponse): Error {
	return new Error(`Discoin API ${apiError.statusCode} error - ${apiError.error}`);
}

/**
 * Throws an error if the response from a fetch operation was not `ok` (ex. a 400 response code).
 * @param res The response from the fetch operation
 */
export async function throwOnResponseNotOk(res: Response): Promise<void> {
	if (!res.ok) {
		const requestError: APIErrorResponse = await res.json();
		throw apiErrorFactory(requestError);
	}
}
