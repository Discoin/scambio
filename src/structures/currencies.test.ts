import test from 'ava';
import nock from 'nock';
import {API_URL} from '../util/constants';
import {APICurrency} from '../types/api';
import {apiCurrencyToCurrency} from '../util/data-transfer-object';
import {currencyStore} from './currencies';

const testCurrency: APICurrency = {id: 'ABC', name: 'Currency name', reserve: 1_000_000, value: '0.1'};

test.after(() => {
	nock.restore();
});

test('Get one currency', async t => {
	nock(API_URL)
		.get(`/currencies/${testCurrency.id}`)
		.reply(200, testCurrency);

	const actualCurrency = await currencyStore.getOne(testCurrency.id);

	return t.deepEqual(actualCurrency, apiCurrencyToCurrency(testCurrency));
});

test('Get many currencies', async t => {
	nock(API_URL)
		.get('/currencies')
		.reply(200, [testCurrency]);

	const actualCurrencies = await currencyStore.getMany();

	t.deepEqual(actualCurrencies, [apiCurrencyToCurrency(testCurrency)]);

	const query = 'filter';

	nock(API_URL)
		// We return the same thing regardless of the query
		// This is just to test what will happen if query is/isn't provided
		.get(`/currencies?${query}`)
		.reply(200, [testCurrency]);

	const actualCurrenciesWithQuery = await currencyStore.getMany(query);

	t.deepEqual(actualCurrenciesWithQuery, [apiCurrencyToCurrency(testCurrency)]);
});
