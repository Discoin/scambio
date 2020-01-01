import test from 'ava';
import nock from 'nock';
import {API_URL} from '../util/constants';
import {APIBot} from '../types/api';
import {apiBotToBot} from '../util/data-transfer-object';
import {botStore} from './bots';

const testBot: APIBot = {
	currency: {id: 'ABC', name: 'Currency name', reserve: 1_000_000, value: '0.1'},
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

	t.deepEqual(actualBots, [apiBotToBot(testBot)]);

	const query = 'filter';

	nock(API_URL)
		// We return the same thing regardless of the query
		// This is just to test what will happen if query is/isn't provided
		.get(`/bots?${query}`)
		.reply(200, [testBot]);

	const actualCurrenciesWithQuery = await botStore.getMany(query);

	t.deepEqual(actualCurrenciesWithQuery, [apiBotToBot(testBot)]);
});
