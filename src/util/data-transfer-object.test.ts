import test from 'ava';
import type {ApiBot, ApiCurrency} from '../types/api';
import {apiBotToBot, apiCurrencyToCurrency} from './data-transfer-object';

test('API currency to currency', t => {
	const apiCurrency: ApiCurrency = {
		id: 'OAT',
		name: 'Dice Oats',
		reserve: '1000000',
		value: 0.1,
		wid: '10',
	};

	const currency = apiCurrencyToCurrency(apiCurrency);

	t.is(currency.id, apiCurrency.id, 'ID does not change');
	t.is(currency.name, apiCurrency.name, 'Name does not change');
	t.is(currency.reserve, Number(apiCurrency.reserve), 'Parses reserve as a number');
	t.is(currency.wid, Number(apiCurrency.wid), 'Parses wid as a number');
	t.is(currency.value, apiCurrency.value, 'Value does not change');
});

const apiBot: ApiBot = {
	id: '388191157869477888',
	name: 'Dice',
	currencies: [
		{
			id: 'OAT',
			name: 'Oats',
			reserve: '1000000',
			value: 0.1,
			wid: '10',
		},
	],
};

test('API bot to bot', t => {
	const bot = apiBotToBot(apiBot);

	t.is(bot.id, apiBot.id, 'ID does not change');
	t.deepEqual(bot.currencies[0], apiCurrencyToCurrency(apiBot.currencies[0]), 'Currency is converted');
});
