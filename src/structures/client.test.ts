import test from 'ava';
import {Client} from './client.js';

const options = {token: 'token', currencyIds: ['ABC', 'xyz']};

test('Client', t => {
	const client = new Client(options.token, options.currencyIds);

	t.is(client.transactions.client, client, 'Transaction store client is this client');

	t.is(client.token, options.token, 'Token property is what was provided');
	t.is(client.currencyIds, options.currencyIds, 'Currency ID property is what was provided');

	const currencies = 'ABC,XYZ';

	t.deepEqual(
		client.commonQueries,
		{
			/* eslint-disable @typescript-eslint/naming-convention */
			RELEVANT_TRANSACTIONS: `filter=to.id||$in||${currencies}`,
			UNHANDLED_TRANSACTIONS: `filter=to.id||$in||${currencies}&filter=handled||$eq||false`,
			/* eslint-enable @typescript-eslint/naming-convention */
		},
		'Common queries are correct',
	);
});
