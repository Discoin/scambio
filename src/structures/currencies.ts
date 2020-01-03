import fetch, {Headers} from 'node-fetch';
import {APICurrency} from '../types/api';
import {Currency} from '../types/discoin';
import {API_URL, USER_AGENT} from '../util/constants';
import {apiCurrencyToCurrency} from '../util/data-transfer-object';
import {throwOnResponseNotOk} from '../util/errors';

/**
 * Store and retrieve many currencies.
 */
export const currencyStore = {
	/**
	 * Get several currencies from the API by specifying a query.
	 * @param query The query for finding currencies
	 * @returns An array of currencies that satisfy the query
	 * @example
	 * client.getMany('filter=value||$gte||0.4');
	 */
	async getMany(query?: string): Promise<Currency[]> {
		// Interpolation of query parameters here is almost certainly a mistake
		const req = fetch(`${API_URL}/currencies${query ? `?${query}` : ''}`, {
			headers: new Headers({'User-Agent': USER_AGENT})
		});

		const res = await req;

		await throwOnResponseNotOk(res);

		const apiCurrencies: APICurrency[] = await res.json();

		const currencies = apiCurrencies.map(apiCurrency => apiCurrencyToCurrency(apiCurrency));

		return currencies;
	},

	/**
	 * Get one currency by ID.
	 * @param code The currency code of the currency to get
	 * @returns The transaction
	 */
	async getOne(code: string): Promise<Currency> {
		const req = fetch(`${API_URL}/currencies/${encodeURIComponent(code)}`, {
			headers: new Headers({'User-Agent': USER_AGENT})
		});

		const res = await req;

		await throwOnResponseNotOk(res);

		const apiCurrency: APICurrency = await res.json();

		const currency = apiCurrencyToCurrency(apiCurrency);

		return currency;
	}
};
