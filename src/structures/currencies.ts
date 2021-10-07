import ky from 'ky-universal';
import type {ApiCurrency, ApiGetManyDto} from '../types/api.js';
import type {Currency} from '../types/discoin.js';
import {API_URL, USER_AGENT} from '../util/constants.js';
import {apiCurrencyToCurrency, getManyResponseIsDto} from '../util/data-transfer-object.js';
import {invariant} from '../util/invariant.js';

/**
 * Store and retrieve many currencies.
 */
export const currencyStore = {
	/**
	 * Get several currencies from the API by specifying a query.
	 * @param query - The query for finding currencies
	 * @returns An array of currencies that satisfy the query
	 * @example
	 * client.getMany('filter=value||$gte||0.4');
	 */
	async getMany(query?: string): Promise<Currency[] | ApiGetManyDto<Currency>> {
		// Interpolation of query parameters here is almost certainly a mistake
		const request = ky.get(`currencies`, {
			headers: {'User-Agent': USER_AGENT},
			prefixUrl: API_URL,
			searchParams: query,
		});

		const response = await request;

		const getManyResponseJson = (await response.json()) as ApiCurrency[] | ApiGetManyDto<ApiCurrency>;

		if (getManyResponseIsDto(getManyResponseJson)) {
			return {
				...getManyResponseJson,
				data: getManyResponseJson.data.map(apiCurrency => apiCurrencyToCurrency(apiCurrency)),
			};
		}

		return getManyResponseJson.map(apiCurrency => apiCurrencyToCurrency(apiCurrency));
	},

	/**
	 * Get one currency by ID.
	 * @param code - The currency code of the currency to get
	 * @returns The transaction
	 */
	async getOne(code: string): Promise<Currency> {
		invariant(typeof code === 'string', "code wasn't string type");

		const request = ky.get(`currencies/${encodeURIComponent(code)}`, {
			headers: {'User-Agent': USER_AGENT},
			prefixUrl: API_URL,
		});

		const response = await request;

		const apiCurrency = (await response.json()) as ApiCurrency;

		const currency = apiCurrencyToCurrency(apiCurrency);

		return currency;
	},
};
