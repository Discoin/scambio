# [@discoin/scambio](https://scambio.discoin.zws.im/)

[![npm version](https://img.shields.io/npm/v/@discoin/scambio)](https://www.npmjs.com/package/@discoin/scambio)
[![codecov](https://codecov.io/gh/Discoin/scambio/branch/merge/graph/badge.svg)](https://codecov.io/gh/Discoin/scambio)
[![MIT license](https://img.shields.io/badge/license-MIT-green)](https://github.com/Discoin/scambio/blob/merge/license)
[![Build Status](https://github.com/Discoin/scambio/workflows/CI/badge.svg)](https://github.com/Discoin/scambio/actions)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![DeepScan grade](https://deepscan.io/api/teams/6595/projects/8606/branches/106731/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6595&pid=8606&bid=106731)

The official JS/TS library for [Discoin](https://github.com/Discoin).
Features browser and first-class TypeScript support.

## Usage

### Install

```sh
yarn add @discoin/scambio

# Or for npm

npm i @discoin/scambio

# Or for pnpm

pnpm i @discoin/scambio
```

If you want to do more complex queries you may want to use the [@nestjsx/crud-request](https://github.com/nestjsx/crud/wiki/Requests#frontend-usage) package, which is specifically designed for the Discoin API.
Most users won't need it but it is listed as a peer dependency.
You can safely ignore any warnings about it if you aren't using it.

### Examples

Below are several examples of how you can use the library.
You do everything through a client instance or its static members.

#### Creating a new client

##### ECMAScript modules

```ts
import Discoin from '@discoin/scambio';

const client = new Discoin('token', ['currencyCode']);
```

##### CommonJS

```js
const Discoin = require('@discoin/scambio').default;

const client = new Discoin('token', ['currencyCode']);
```

#### Creating a transaction

```js
const newTransaction = client.transactions.create({
	from: 'XYZ',
	to: 'ABC',
	amount: 100,
	// Discord user ID
	user: '210024244766179329'
});
```

#### Getting transactions

##### Get one transaction by ID

```js
await client.transactions.getOne('808179ef-aef4-4bbb-ab37-db310235fb0c');
```

##### Get many transactions with built-in queries

This uses common queries, which are generated specifically for your client and don't need any extra dependencies.

```js
await client.transactions.getMany(client.commonQueries.UNHANDLED_TRANSACTIONS);
```

##### Get many transactions with query builder

This uses the `@nestjsx/crud-request` query builder.
You should use this when you are performing very complex queries or are dynamically creating queries.

```ts
import {RequestQueryBuilder, CondOperator} from '@nestjsx/crud-request';

const query = RequestQueryBuilder.create()
	// Only get transactions where the `amount` field > 10
	.setFilter({
		field: 'amount',
		operator: CondOperator.GREATER_THAN,
		value: 10
	})
	.query();

await client.transactions.getMany(query);
```

#### Processing transactions

You can mark a transaction as handled after you have paid the user.
This helps to keep transactions atomic and can make retrying failed transactions very simple.

```ts
const unhandledTransactions = await client.transactions.getMany(client.commonQueries.UNHANDLED_TRANSACTIONS);

unhandledTransactions.forEach(async transaction => {
	console.log(`${transaction.user} received ${transaction.payout} ${transaction.to.id}`);

	// After you're done with the transaction, mark it as completed
	await transaction.update({handled: true});
});
```

## Contributing

Pull requests and issues are always welcome!
Please, read our [Code of Conduct](CODE_OF_CONDUCT.md) and our [contributing guide](CONTRIBUTING.md) if you are interested in helping to improve the library..

## Licence

Copyright 2019-2020 [Jonah Snider](https://jonah.pw).
Distributed under the [MIT licence](LICENCE.md).

If you would like the licence to be something other than MIT for you or your organization please get in touch.
