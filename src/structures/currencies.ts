import ky from 'ky-universal';
import {APICurrency, APIGetManyDTO} from '../types/api';
import {Currency} from '../types/discoin';
import {API_URL, USER_AGENT} from '../util/constants';
import {apiCurrencyToCurrency, getManyResponseIsDTO} from '../util/data-transfer-object';

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
	async getMany(query?: string): Promise<Currency[] | APIGetManyDTO<Currency>> {
		// Interpolation of query parameters here is almost certainly a mistake
		const request = ky.get(`currencies${query ? `?${query}` : ''}`, {
			headers: {'User-Agent': USER_AGENT},
			prefixUrl: API_URL
		});

		const response = await request;

		const getManyResponseJSON: APICurrency[] | APIGetManyDTO<APICurrency> = await response.json();

		if (getManyResponseIsDTO(getManyResponseJSON)) {
			return {
				...getManyResponseJSON,
				data: getManyResponseJSON.data.map(apiCurrency => apiCurrencyToCurrency(apiCurrency))
			};
		}

		return getManyResponseJSON.map(apiCurrency => apiCurrencyToCurrency(apiCurrency));
	},

	/**
	 * Get one currency by ID.
	 * @param code The currency code of the currency to get
	 * @returns The transaction
	 */
	async getOne(code: string): Promise<Currency> {
		const request = ky.get(`currencies/${encodeURIComponent(code)}`, {
			headers: {'User-Agent': USER_AGENT},
			prefixUrl: API_URL
		});

		const response = await request;

		const apiCurrency: APICurrency = await response.json();

		const currency = apiCurrencyToCurrency(apiCurrency);

		return currency;
	}
};
