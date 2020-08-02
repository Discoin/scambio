import test, {ExecutionContext} from 'ava';
import {Client} from './client';

const options = {token: 'token', currencyIDs: ['ABC']};

test('Client', (t: ExecutionContext) => {
	const client = new Client(options.token, options.currencyIDs);

	t.is(client.transactions.client, client, 'Transaction store client is this client');

	t.is(client.token, options.token, 'Token property is what was provided');
	t.is(client.currencyIDs, options.currencyIDs, 'Currency ID property is what was provided');

	const currencies = options.currencyIDs.map(encodeURIComponent).join(',');

	t.deepEqual(
		client.commonQueries,
		{
			RELEVANT_TRANSACTIONS: `filter=to.id||inL||${currencies}`,
			UNHANDLED_TRANSACTIONS: `filter=to.id||inL||${currencies}&filter=handled||eq||false`
		},
		'Common queries are correct'
	);
});
