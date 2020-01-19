import test from 'ava';
import {APICurrency, APIBot} from '../types/api';
import {apiCurrencyToCurrency, apiBotToBot} from './data-transfer-object';

test('API currency to currency', t => {
	const apiCurrency: APICurrency = {
		id: 'OAT',
		name: 'Dice Oats',
		reserve: '1_000_000',
		value: 0.1
	};

	const currency = apiCurrencyToCurrency(apiCurrency);

	t.is(currency.id, apiCurrency.id, 'ID does not change');
	t.is(currency.name, apiCurrency.name, 'Name does not change');
	t.is(currency.reserve, parseFloat(apiCurrency.reserve), 'Parses reserve as a number');
	t.is(currency.value, apiCurrency.value, 'Value does not change');
});

test('API bot to bot', t => {
	const apiBot: APIBot = {
		id: '388191157869477888',
		currency: {
			id: 'OAT',
			name: 'Dice Oats',
			reserve: '1_000_000',
			value: 0.1
		}
	};

	const bot = apiBotToBot(apiBot);

	t.is(bot.id, apiBot.id, 'ID does not change');
	t.deepEqual(bot.currency, apiCurrencyToCurrency(apiBot.currency), 'Currency is converted');
});
