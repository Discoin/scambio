import test from 'ava';
import nock from 'nock';
import {API_URL} from '../util/constants';
import {APIBot, APIGetManyDTO} from '../types/api';
import {apiBotToBot} from '../util/data-transfer-object';
import {botStore} from './bots';

const testBot: APIBot = {
	currency: {id: 'ABC', name: 'Currency name', reserve: '1_000_000', value: '0.1'},
	id: '123456789'
};

test.after(() => {
	nock.restore();
});

test('Get one bot', async t => {
	nock(API_URL)
		.get(`/bots/${testBot.id}`)
		.reply(200, testBot);

	const actualBot = await botStore.getOne(testBot.id);

	return t.deepEqual(actualBot, apiBotToBot(testBot));
});

test('Get many bots', async t => {
	nock(API_URL)
		.get('/bots')
		.reply(200, [testBot]);

	const actualBots = await botStore.getMany();

	t.deepEqual(actualBots, [apiBotToBot(testBot)], 'No query');

	const filteredQuery = 'filter=id||eq||388191157869477888';

	nock(API_URL)
		// We return the same thing regardless of the query
		// This is just to test what will happen if query is/isn't provided
		.get(`/bots?${filteredQuery}`)
		.reply(200, [testBot]);

	const filteredBots = await botStore.getMany(filteredQuery);

	t.deepEqual(filteredBots, [apiBotToBot(testBot)], 'Filtered query');

	const paginatedQuery = 'page=1&limit=1';

	nock(API_URL)
		.get(`/bots?${paginatedQuery}`)
		.reply(200, {
			count: 1,
			data: [testBot],
			page: 1,
			pageCount: 1,
			total: 1
		} as APIGetManyDTO<APIBot>);

	const paginatedTransactions = await botStore.getMany(paginatedQuery);

	t.deepEqual(
		paginatedTransactions,
		{count: 1, page: 1, pageCount: 1, total: 1, data: [apiBotToBot(testBot)]},
		'Paginated query'
	);
});
