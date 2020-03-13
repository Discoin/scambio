import packageJSON from '../../package.json';

/** Regular expression for a v4 UUUID (used for transaction IDs). */
export const UUID_V4_REG_EXP = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

/** The base URL for the API. */
export const API_URL = 'https://discoin.zws.im';

/**
 * Set of HTTP request methods to indicate the desired action to be performed for a given resource.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 */
export enum HTTPRequestMethods {
	/** The `GET` method requests a representation of the specified resource. Requests using `GET` should only retrieve data. */
	GET = 'GET',
	/** The `HEAD` method asks for a response identical to that of a `GET` request, but without the response body. */
	HEAD = 'HEAD',
	/** The `POST` method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server. */
	POST = 'POST',
	/** The `PUT` method replaces all current representations of the target resource with the request payload. */
	PUT = 'PUT',
	/** The `DELETE` method deletes the specified resource. */
	DELETE = 'DELETE',
	/** The `CONNECT` method establishes a tunnel to the server identified by the target resource. */
	CONNECT = 'CONNECT',
	/** The `OPTIONS` method is used to describe the communication options for the target resource. */
	OPTIONS = 'OPTIONS',
	/** The `TRACE` method performs a message loop-back test along the path to the target resource. */
	TRACE = 'TRACE',
	/** The `PATCH` method is used to apply partial modifications to a resource. */
	PATCH = 'PATCH'
}

/**
 * The User-Agent header to use in requests.
 * Automatically generated from the version of the package you are using.
 * @example
 * 'Scambio v3.0.0'
 */
export const USER_AGENT = `Scambio v${packageJSON.version}`;
