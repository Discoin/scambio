import {APICurrency, APIBot, APIGetManyDTO, APITransaction} from '../types/api';
import {Currency, Bot} from '../types/discoin';

/**
 * Convert an API currency to a regular currency.
 * @param currency API currency to convert
 * @returns The parsed currency
 */
export function apiCurrencyToCurrency(currency: APICurrency): Currency {
	const {reserve, wid, ...rest} = currency;

	return {...rest, reserve: Number(reserve), wid: Number(wid)};
}

/**
 * Convert an API bot to a regular bot.
 * Wrapper around `apiCurrencyToCurrency()`.
 * @param bot The API bot to convert
 */
export function apiBotToBot(bot: APIBot): Bot {
	const {currencies, ...rest} = bot;

	return {...rest, currencies: currencies.map(currency => apiCurrencyToCurrency(currency))};
}

type GetManyResponse = APIBot[] | APICurrency[] | APITransaction[];

/**
 * Check if a `getMany` response from the API is a DTO.
 * @param getManyResponse The `getMany` response to check
 * @returns Boolean of whether or not the provided response is a DTO
 */
export function getManyResponseIsDTO<T>(getManyResponse: GetManyResponse | APIGetManyDTO<T>): getManyResponse is APIGetManyDTO<T> {
	return !Array.isArray(getManyResponse) && Object.prototype.hasOwnProperty.call(getManyResponse, 'data');
}

/**
 * Check if a currency object (`APICurrency` or `Currency`) is an `APICurrency`.
 * @param currency Currency object to check
 * @returns Boolean of whether or not the provided currency is an API currency.
 */
export function currencyIsAPICurrency(currency: APICurrency | Currency): currency is APICurrency {
	return typeof currency.reserve === 'string' && typeof currency.value === 'string';
}
