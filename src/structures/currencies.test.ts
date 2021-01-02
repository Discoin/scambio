import test, {ExecutionContext} from 'ava';
import nock from 'nock';
import {API_URL} from '../util/constants';
import {APICurrency, APIGetManyDTO} from '../types/api';
import {apiCurrencyToCurrency} from '../util/data-transfer-object';
import {Currency} from '../types/discoin';
import {currencyStore} from './currencies';

const testCurrency: APICurrency = {id: 'ABC', name: 'Currency name', reserve: '1000000', value: 0.1, wid: '10'};

test.after(() => {
	nock.restore();
});

test('Get one currency', async (t: ExecutionContext) => {
	nock(API_URL).get(`/currencies/${testCurrency.id}`).reply(200, testCurrency);

	const actualCurrency = await currencyStore.getOne(testCurrency.id);

	t.deepEqual(actualCurrency, apiCurrencyToCurrency(testCurrency));
});

const filteredQuery = 'filter=value||$gte||0.4';
const paginatedQuery = 'page=1&limit=1';

test('Get many currencies', async (t: ExecutionContext) => {
	nock(API_URL).get('/currencies').reply(200, [testCurrency]);

	const actualCurrencies = await currencyStore.getMany();

	t.deepEqual(actualCurrencies, [apiCurrencyToCurrency(testCurrency)] as Currency[], 'No query');

	nock(API_URL)
		// We return the same thing regardless of the query
		// This is just to test what will happen if query is/isn't provided
		.get(`/currencies?${filteredQuery}`)
		.reply(200, [testCurrency]);

	const filteredCurrencies = await currencyStore.getMany(filteredQuery);

	t.deepEqual(filteredCurrencies, [apiCurrencyToCurrency(testCurrency)] as Currency[], 'Filtered query');

	nock(API_URL)
		.get(`/currencies?${paginatedQuery}`)
		.reply(200, {
			count: 1,
			data: [testCurrency],
			page: 1,
			pageCount: 1,
			total: 1
		} as APIGetManyDTO<APICurrency>);

	const paginatedTransactions = await currencyStore.getMany(paginatedQuery);

	t.deepEqual(paginatedTransactions, {count: 1, page: 1, pageCount: 1, total: 1, data: [apiCurrencyToCurrency(testCurrency)]}, 'Paginated query');
});
