import type {ApiCurrency, ApiBot, ApiGetManyDto, ApiTransaction} from '../types/api';
import type {Currency, Bot} from '../types/discoin';

/**
 * Convert an API currency to a regular currency.
 * @param currency - API currency to convert
 * @returns The parsed currency
 * @internal
 */
export function apiCurrencyToCurrency(currency: ApiCurrency): Currency {
	const {reserve, wid, ...rest} = currency;

	return {...rest, reserve: Number(reserve), wid: Number(wid)};
}

/**
 * Convert an API bot to a regular bot.
 * Wrapper around `apiCurrencyToCurrency()`.
 * @param bot - The API bot to convert
 * @internal
 */
export function apiBotToBot(bot: ApiBot): Bot {
	const {currencies, ...rest} = bot;

	return {...rest, currencies: currencies.map(currency => apiCurrencyToCurrency(currency))};
}

type GetManyResponse = ApiBot[] | ApiCurrency[] | ApiTransaction[];

/**
 * Check if a `getMany` response from the API is a DTO.
 * @param getManyResponse - The `getMany` response to check
 * @returns Boolean of whether or not the provided response is a DTO
 * @internal
 */
export function getManyResponseIsDto<T>(getManyResponse: GetManyResponse | ApiGetManyDto<T>): getManyResponse is ApiGetManyDto<T> {
	return !Array.isArray(getManyResponse) && Object.prototype.hasOwnProperty.call(getManyResponse, 'data');
}

/**
 * Check if a currency object (`APICurrency` or `Currency`) is an `APICurrency`.
 * @param currency - Currency object to check
 * @returns Boolean of whether or not the provided currency is an API currency.
 * @internal
 */
export function currencyIsApiCurrency(currency: ApiCurrency | Currency): currency is ApiCurrency {
	return typeof currency.reserve === 'string' && typeof currency.value === 'string';
}
