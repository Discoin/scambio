# [@discoin/scambio](https://scambio.discoin.zws.im/)

[![Build Status](https://github.com/Discoin/scambio/workflows/CI/badge.svg)](https://github.com/Discoin/scambio/actions)
[![codecov](https://codecov.io/gh/Discoin/scambio/branch/merge/graph/badge.svg)](https://codecov.io/gh/Discoin/scambio)
[![MIT license](https://img.shields.io/badge/license-MIT-green)](https://github.com/Discoin/scambio/blob/merge/license)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![DeepScan grade](https://deepscan.io/api/teams/6595/projects/8606/branches/106731/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6595&pid=8606&bid=106731)

The official Node.js library for [Discoin](https://github.com/Discoin).
Features async await syntax and first-class TypeScript support.

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

#### Creating a new client

```ts
import Discoin from '@discoin/scambio';
// Or for CommonJS: const Discoin = require('@discoin/scambio');

const client = new Discoin('token', 'currencyCode');
```

#### Creating a transaction

```ts
// Get the currency
const destinationCurrency = client.currencies.getOne('currencyCode');

// Create the transaction
const newTransaction = client.transactions.create({
  to: destinationCurrency
  amount: 10
  // Discord user ID
  user: 'userID'
});
```

#### Getting transactions

```ts
// Get a transaction by ID
await client.transactions.getOne('transactionID');

// Get all the transactions that match a filter
// (this uses @nestjsx/crud-request)
import {RequestQueryBuilder, CondOperator} from '@nestjsx/crud-request';

const filter = RequestQueryBuilder.create()
	// Only get transactions where the `amount` field > 10
	.setFilter({
		field: 'amount',
		operator: CondOperator.GREATER_THAN,
		value: 10
	})
	.query();

await client.transactions.getMany(filter);

// Get unhandled transactions for your bot
// (this uses common queries)

await client.transactions.getMany(client.commonQueries.UNHANDLED_TRANSACTIONS);
```

#### Processing transactions

```ts
// Get the unhandled transactions for your bot
const unhandled = await client.transactions.getMany(client.commonQueries.UNHANDLED_TRANSACTIONS);

// If there are no unhandled transactions, don't do anything
if (!unhandled.length) return;

// Iterate through the transactions
for (const transaction of unhandled) {
	// Add the amount of money the user needs to get
	// WARNING: That amount is given on the `payout` property, **not** the `amount` property
	console.log(`${transaction.user} got ${transaction.payout}$`);

	// After you're done with that, mark it as completed
	await transaction.update({handled: true});
}
```

## Contributing

Pull requests and issues are always welcome! Please, read our [Code of Conduct](CODE_OF_CONDUCT.md) and use the issue tracker for bug requests and feature submissions.

## Legal

Copyright 2019-Present © [Charalampos Fanoulis](https://enkiel.cloud) and [Jonah Snider](https://jonah.pw). Distributed under the [MIT licence](LICENCE.md).

## Support our work

This project is open-source, thus we don't get any monetary compensation for our work. If you want to support our work, please feel free to donate to us:

- Support [**Charalampos Fanoulis**](https://github.com/Discoin/scambio/commits?author=cfanoulis):

| Method                                                                                                                                                                                                                              | Address                                                             | Notes                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [![Pledge using Patreon](https://github.com/Discoin/scambio/raw/master/.github/readme-assets/patreon.jpg)](https://www.patreon.com/join/enkiel8029?)                                                                                | [Pledge using on Patreon](https://www.patreon.com/join/enkiel8029?) | Patrons get exclusive access to pre-release projects, discounts on comissions, behind-the-scenes posts and more!                           |
| [![Donate using PayPal](https://www.paypalobjects.com/digitalassets/c/website/marketing/na/us/logo-center/9_bdg_secured_by_pp_2line.png)](https://cfanoulis.page.link/donate-paypal)                                                | [Donate using PayPal](https://cfanoulis.page.link/donate-paypal)    |
| [![Donate using bitcoin](https://github.com/Discoin/scambio/raw/master/.github/readme-assets/btc.png)](bitcoin:bc1q3e5jhh9qrk4g80ljlvu66u2dsr89v57g5madjr?message=Donation%20to%20Charalampos%27s%20OSS%20projects&time=1577294923) | `bc1q3e5jhh9qrk4g80ljlvu66u2dsr89v57g5madjr`                        |
| ![Donate using Stellar](https://github.com/Discoin/scambio/raw/master/.github/readme-assets/stellar.png)                                                                                                                            | `cfanoulis*keybase.io`                                              | If your wallet or network doesn't support federation, please use `GCVAESPQ3OSXZQCTLJNEXD35GA5CWXPQ6FG6JVBFIDNRRJIG77OKUB4I` as the address |

- Support [**Jonah Snider**](https://github.com/Discoin/scambio/commits?author=pizzafox):

| Method                                                                                                                                            | Address                                                        | Notes                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [![Pledge using Patreon](https://github.com/Discoin/scambio/raw/master/.github/readme-assets/patreon.jpg)](https://www.patreon.com/join/pizzafox) | [Pledge using Patreon](https://www.patreon.com/join/pizzafox/) |                                                                                                                                            |
| ![Donate with Zcash](https://github.com/Discoin/scambio/raw/master/.github/readme-assets/zcash.png)                                               | `t1NLnqT6h8BnvZ683GhQ2hBsv3GHsNtEkVE`                          |                                                                                                                                            |
| ![Donate using bitcoin](https://github.com/Discoin/scambio/raw/master/.github/readme-assets/btc.png)                                              | `1754GdSYLzH7ukgZs3ZPSjk9EsK3qqK9xY`                           |                                                                                                                                            |
| ![Donate using Stellar](https://github.com/Discoin/scambio/raw/master/.github/readme-assets/stellar.png)                                          | `pizzafox*keybase.io`                                          | If your wallet or network doesn't support federation, please use `GAOLRCYYNHBGZFYHT7PK2C4TRKEXTKPHJA6LS2MFWYHIVQHBDJVOIS23` as the address |
