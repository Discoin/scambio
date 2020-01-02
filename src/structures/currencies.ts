import fetch, {Headers} from 'node-fetch';
import {Currency} from '../types/discoin';
import {API_URL, USER_AGENT} from '../util/constants';
import {APICurrency} from '../types/api';
import {apiCurrencyToCurrency} from '../util/data-transfer-object';

/**
 * Store and retrieve many currencies.
 */
export const currencyStore = {
	/**
	 * Get several currencies from the API by specifying a query.
	 * @param query The query for finding currencies (not URL encoded)
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

		const apiCurrencies: APICurrency[] = await res.json();

		const currencies = apiCurrencies.map(apiCurrency => apiCurrencyToCurrency(apiCurrency));

		return currencies;
	},

	/**
	 * Get one currency by ID.
	 * @param code The currency code of the currency to get
	 * @param fetchClient The fetch client to use for the network request
	 * @returns The transaction
	 */
	async getOne(code: string, fetchClient: typeof fetch = fetch): Promise<Currency> {
		const req = fetchClient(`${API_URL}/currencies/${code}`, {
			headers: new Headers({'User-Agent': USER_AGENT})
		});

		const res = await req;

		const apiCurrency: APICurrency = await res.json();

		const currency = apiCurrencyToCurrency(apiCurrency);

		return currency;
	}
};
