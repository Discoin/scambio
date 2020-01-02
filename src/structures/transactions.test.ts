import test from 'ava';
import nock from 'nock';
import {API_URL} from '../util/constants';
import {APITransaction, APITransactionCreate} from '../types/api';
import {Transaction} from './transactions';
import Client from '..';

const notAUUID = 'not a v4 UUID';

const testTransaction: APITransaction = {
	amount: 1000,
	from: {id: 'OAT', name: 'Dice Oats'},
	to: {id: 'DTS', name: 'DiscordTel Credits'},
	handled: false,
	id: 'a62b3566-60a3-4241-8c11-316775b973ff',
	payout: 100,
	timestamp: '2020-01-01T12:28:17.294Z',
	user: '210024244766179329'
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

	t.deepEqual(actualTransactions, [new Transaction(client, testTransaction)]);

	const query = 'filter=to.id||eq||OAT&filter=handled||eq||false';

	nock(API_URL)
		// We return the same thing regardless of the query
		// This is just to test what will happen if query is/isn't provided
		.get(`/transactions?${query}`)
		.reply(200, [testTransaction]);

	const actualTransactionsWithQuery = await client.transactions.getMany(query);

	t.deepEqual(actualTransactionsWithQuery, [new Transaction(client, testTransaction)]);
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
		amount: testTransaction.amount,
		to: testTransaction.to.id,
		user: testTransaction.user
	});

	t.true(scope.isDone(), 'Network request is finished');
	t.deepEqual(
		requestBody,
		{
			amount: testTransaction.amount,
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
});
