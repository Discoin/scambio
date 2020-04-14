import test, {ExecutionContext} from 'ava';
import {APICurrency, APIBot} from '../types/api';
import {apiCurrencyToCurrency, apiBotToBot} from './data-transfer-object';
import {ReadonlyDeep} from 'type-fest';

test('API currency to currency', (t: ReadonlyDeep<ExecutionContext>) => {
	const apiCurrency: APICurrency = {
		id: 'OAT',
		name: 'Dice Oats',
		reserve: '1000000',
		value: 0.1
	};

	const currency = apiCurrencyToCurrency(apiCurrency);

	t.is(currency.id, apiCurrency.id, 'ID does not change');
	t.is(currency.name, apiCurrency.name, 'Name does not change');
	t.is(currency.reserve, Number.parseFloat(apiCurrency.reserve), 'Parses reserve as a number');
	t.is(currency.value, apiCurrency.value, 'Value does not change');
});

const apiBot: APIBot = {
	id: '388191157869477888',
	currency: {
		id: 'OAT',
		name: 'Dice Oats',
		reserve: '1000000',
		value: 0.1
	}
};

test('API bot to bot', (t: ReadonlyDeep<ExecutionContext>) => {
	const bot = apiBotToBot(apiBot);

	t.is(bot.id, apiBot.id, 'ID does not change');
	t.deepEqual(bot.currency, apiCurrencyToCurrency(apiBot.currency), 'Currency is converted');
});
