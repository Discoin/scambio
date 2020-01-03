import test from 'ava';
import {Response, Headers} from 'node-fetch';
import {APIErrorResponse} from '../types/api';
import {apiErrorFactory, throwOnResponseNotOk} from './errors';

const apiError: APIErrorResponse = {
	error: 'Unauthorized',
	statusCode: 401
};

test('API error factory', t => {
	t.is(
		apiErrorFactory(apiError).message,
		`Discoin API ${apiError.statusCode} error - ${apiError.error}`,
		'Error message string'
	);
});

const response = new Response(JSON.stringify(apiError), {
	headers: new Headers({'Content-Type': 'application/json'}),
	status: apiError.statusCode
});

test('Throw on response not ok', async t => {
	const expectedError = apiErrorFactory(apiError);

	await t.throwsAsync(async () => throwOnResponseNotOk(response), {instanceOf: Error, message: expectedError.message});
});
