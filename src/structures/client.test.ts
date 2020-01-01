import test from 'ava';
import {Client} from './client';

test('Client', t => {
	const options = {token: 'token', currencyID: 'ABC'};
	const client = new Client(options.token, options.currencyID);

	t.is(client.transactions.client, client, 'Transaction store client is this client');

	t.is(client.token, options.token, 'Token property is what was provided');
	t.is(client.currencyID, options.currencyID, 'Currency ID property is what was provided');

	t.deepEqual(
		client.commonQueries,
		{
			RELEVANT_TRANSACTIONS: `filter=to.id||eq||${options.currencyID}`,
			UNHANDLED_TRANSACTIONS: `filter=to.id||eq||${options.currencyID}&filter=handled||eq||false`
		},
		'Common queries are correct'
	);
});
