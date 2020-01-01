import {APICurrency, APIBot} from '../types/api';
import {Currency, Bot} from '../types/discoin';

/**
 * Convert an API currency to a regular currency.
 * @param currency API currency to convert
 * @returns The parsed currency
 */
export function apiCurrencyToCurrency(currency: APICurrency): Currency {
	const {value, ...rest} = currency;

	return {...rest, value: parseFloat(value)};
}

/**
 * Convert an API bot to a regular bot.
 * Wrapper around `apiCurrencyToCurrency()`.
 * @param bot The API bot to convert
 */
export function apiBotToBot(bot: APIBot): Bot {
	const {currency, ...rest} = bot;

	return {...rest, currency: apiCurrencyToCurrency(currency)};
}
