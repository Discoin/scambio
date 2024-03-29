import packageJSON from '../../package.json';

/**
 * Regular expression for a v4 UUUID (used for transaction IDs).
 * @internal
 */
export const UUID_V4_REG_EXP = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

/**
 * The base URL for the API.
 * @internal
 */
export const API_URL = 'https://discoin.zws.im';

/**
 * The User-Agent header to use in requests.
 * Automatically generated from the version of the package you are using.
 * @example 'Scambio v3.0.0'
 * @internal
 */
export const USER_AGENT = `Scambio v${packageJSON.version}`;
