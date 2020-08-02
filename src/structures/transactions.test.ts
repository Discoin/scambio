import test, {ExecutionContext} from 'ava';
import nock from 'nock';
import {Except} from 'type-fest';
import {APIGetManyDTO, APITransaction, APITransactionCreate} from '../types/api';
import {API_URL} from '../util/constants';
import {Client} from './client';
import {Transaction} from './transactions';

const notAUUID = 'not a v4 UUID';

const testTransaction: APITransaction = {
	amount: '1000',
	from: {id: 'OAT', name: 'Oats', bot: {discord_id: '123', name: 'Dice'}},
	to: {id: 'DTS', name: 'Credits', bot: {discord_id: '123', name: 'DTel'}},
	handled: false,
	id: 'a62b3566-60a3-4241-8c11-316775b973ff',
	payout: 100,
	timestamp: '2020-01-01T12:28:17.294Z',
	user: '210024244766179329'
};

const fullTransaction: Except<Transaction, 'update'> = {
	...testTransaction,
	timestamp: new Date(0),
	amount: 1000
};

const options = {token: 'token', currencyIDs: ['OAT']};
const client = new Client(options.token, options.currencyIDs);

test.after(() => {
	nock.restore();
});

test('Get one transaction', async (t: ExecutionContext) => {
	nock(API_URL).get(`/transactions/${testTransaction.id}`).reply(200, testTransaction);

	const actualTransaction = await client.transactions.getOne(testTransaction.id);

	t.deepEqual(actualTransaction, new Transaction(client, testTransaction));

	await t.throwsAsync(async () => client.transactions.getOne(notAUUID), {instanceOf: RangeError}, 'Throws error when invalid UUID is provided');
});

const paginatedQuery = 'page=1&limit=1';
const filteredQuery = 'filter=to.id||eq||OAT&filter=handled||eq||false';

test('Get many transactions', async (t: ExecutionContext) => {
	nock(API_URL).get('/transactions').reply(200, [testTransaction]);

	const actualTransactions = await client.transactions.getMany();

	t.deepEqual(actualTransactions, [new Transaction(client, testTransaction)], 'No query');

	nock(API_URL)
		// We return the same thing regardless of the query
		// This is just to test what will happen if query is/isn't provided
		.get(`/transactions?${filteredQuery}`)
		.reply(200, [testTransaction]);

	const actualTransactionsWithQuery = await client.transactions.getMany(filteredQuery);

	t.deepEqual(actualTransactionsWithQuery, [new Transaction(client, testTransaction)], 'Filtered query');

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

	t.deepEqual(paginatedTransactions, {page: 1, pageCount: 1, total: 1, count: 1, data: [new Transaction(client, testTransaction)]}, 'Paginated query');
});

test('Update transaction', async (t: ExecutionContext) => {
	const transaction = new Transaction(client, testTransaction);

	nock(API_URL).patch(`/transactions/${testTransaction.id}`).reply(200, testTransaction);

	await transaction.update({handled: true});

	t.true(transaction.handled, 'Handled is updated');
});

test('Create transaction', async (t: ExecutionContext) => {
	// `nock` doesn't really have a way to validate request bodies, so we do this
	let requestBody;

	const scope = nock(API_URL)
		.post('/transactions', (body: APITransactionCreate) => {
			// Body filter is used to save the provided request body for validation later
			requestBody = body;
			return true;
		})
		.reply(201, testTransaction);

	// Send the network request that creates the transaction
	await client.transactions.create({
		amount: Number(testTransaction.amount),
		to: testTransaction.to.id,
		from: testTransaction.from.id,
		user: testTransaction.user
	});

	t.true(scope.isDone(), 'Network request is finished');
	t.deepEqual(
		requestBody,
		{
			amount: Number(testTransaction.amount),
			from: testTransaction.from.id,
			to: testTransaction.to.id,
			user: testTransaction.user
		} as APITransactionCreate,
		'Request body should have correct structure and information'
	);
});

test('Transaction class', (t: ExecutionContext) => {
	const {id: _id, ...rest} = testTransaction;

	t.throws(() => new Transaction(client, {...rest, id: notAUUID}), {instanceOf: RangeError}, 'Throws error when invalid UUID is provided');

	t.deepEqual(new Transaction(client, fullTransaction).timestamp, fullTransaction.timestamp);
});
