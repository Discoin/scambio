import test from 'ava';
import nock from 'nock';
import {Except} from 'type-fest';
import {API_URL} from '../util/constants';
import {APITransaction, APITransactionCreate, APIGetManyDTO} from '../types/api';
import {Transaction} from './transactions';
import {Client} from './client';

const notAUUID = 'not a v4 UUID';

const testTransaction: APITransaction = {
	amount: '1000',
	from: {id: 'OAT', name: 'Dice Oats', reserve: '1000000', value: '0.1'},
	to: {id: 'DTS', name: 'DiscordTel Credits', reserve: '1000000', value: '1'},
	handled: false,
	id: 'a62b3566-60a3-4241-8c11-316775b973ff',
	payout: 100,
	timestamp: '2020-01-01T12:28:17.294Z',
	user: '210024244766179329'
};

const fullTransaction: Except<Transaction, 'update'> = {
	...testTransaction,
	timestamp: new Date(0),
	amount: 1000,
	from: {id: 'OAT', name: 'Dice Oats', reserve: 1000, value: 100},
	to: {id: 'DTS', name: 'DiscordTel Credits', reserve: 1000, value: 100}
};

const options = {token: 'token', currencyID: 'OAT'};
const client = new Client(options.token, options.currencyID);

test.after(() => {
	nock.restore();
});

test('Get one transaction', async t => {
	nock(API_URL)
		.get(`/transactions/${testTransaction.id}`)
		.reply(200, testTransaction);

	const actualTransaction = await client.transactions.getOne(testTransaction.id);

	t.deepEqual(actualTransaction, new Transaction(client, testTransaction));

	await t.throwsAsync(
		async () => client.transactions.getOne(notAUUID),
		RangeError,
		'Throws error when invalid UUID is provided'
	);
});

test('Get many transactions', async t => {
	const client = new Client(options.token, options.currencyID);

	nock(API_URL)
		.get('/transactions')
		.reply(200, [testTransaction]);

	const actualTransactions = await client.transactions.getMany();

	t.deepEqual(actualTransactions, [new Transaction(client, testTransaction)], 'No query');

	const filteredQuery = 'filter=to.id||eq||OAT&filter=handled||eq||false';

	nock(API_URL)
		// We return the same thing regardless of the query
		// This is just to test what will happen if query is/isn't provided
		.get(`/transactions?${filteredQuery}`)
		.reply(200, [testTransaction]);

	const actualTransactionsWithQuery = await client.transactions.getMany(filteredQuery);

	t.deepEqual(actualTransactionsWithQuery, [new Transaction(client, testTransaction)], 'Filtered query');

	const paginatedQuery = 'page=1&limit=1';

	nock(API_URL)
		.get(`/transactions?${paginatedQuery}`)
		.reply(200, {
			count: 1,
			data: [testTransaction],
			page: 1,
			pageCount: 1,
			total: 1
		} as APIGetManyDTO<APITransaction>);

	const paginatedTransactions = await client.transactions.getMany(paginatedQuery);

	t.deepEqual(
		paginatedTransactions,
		{page: 1, pageCount: 1, total: 1, count: 1, data: [new Transaction(client, testTransaction)]},
		'Paginated query'
	);
});

test('Update transaction', async t => {
	const transaction = new Transaction(client, testTransaction);

	nock(API_URL)
		.patch(`/transactions/${testTransaction.id}`)
		.reply(200, testTransaction);

	await transaction.update({handled: true});

	t.true(transaction.handled, 'Handled is updated');
});

test('Create transaction', async t => {
	// `nock` doesn't really have a way to validate request bodies, so we do this
	let requestBody;

	const scope = nock(API_URL)
		.post('/transactions', body => {
			// Body filter is used to save the provided request body for validation late
			requestBody = body;
			return body;
		})
		.reply(201, testTransaction);

	// Send the network request that creates the transaction
	await client.transactions.create({
		amount: parseFloat(testTransaction.amount),
		to: testTransaction.to.id,
		user: testTransaction.user
	});

	t.true(scope.isDone(), 'Network request is finished');
	t.deepEqual(
		requestBody,
		{
			amount: parseFloat(testTransaction.amount),
			toId: testTransaction.to.id,
			user: testTransaction.user
		} as APITransactionCreate,
		'Request body should have correct structure and information'
	);
});

test('Transaction class', t => {
	const {id: _id, ...rest} = testTransaction;

	t.throws(
		() => new Transaction(client, {...rest, id: notAUUID}),
		RangeError,
		'Throws error when invalid UUID is provided'
	);

	t.deepEqual(new Transaction(client, fullTransaction).timestamp, fullTransaction.timestamp);
});
