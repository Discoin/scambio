import ky from 'ky-universal';
import {APICurrency} from '../types/api';
import {Currency} from '../types/discoin';
import {API_URL, USER_AGENT} from '../util/constants';
import {apiCurrencyToCurrency} from '../util/data-transfer-object';

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
		const req = ky.get(`currencies${query ? `?${query}` : ''}`, {
			headers: {'User-Agent': USER_AGENT},
			prefixUrl: API_URL
		});

		const res = await req;

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
		const req = ky.get(`currencies/${encodeURIComponent(code)}`, {
			headers: {'User-Agent': USER_AGENT},
			prefixUrl: API_URL
		});

		const res = await req;

		const apiCurrency: APICurrency = await res.json();

		const currency = apiCurrencyToCurrency(apiCurrency);

		return currency;
	}
};
