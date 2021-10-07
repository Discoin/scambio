import type {Token} from '../types/discoin';
import {invariant} from '../util/invariant';
import {TransactionStore} from './transactions';
import {currencyStore} from './currencies';
import {botStore} from './bots';

/**
 * Common queries to use for `getMany` operations.
 */
export interface CommonQueries {
	/**
	 * Get unhandled transactions for your bot.
	 */
	UNHANDLED_TRANSACTIONS: string;
	/**
	 * Get all transactions for your bot.
	 */
	RELEVANT_TRANSACTIONS: string;
}

/**
 * Use this client to interface with Discoin and create transactions.
 */
export class Client {
	/** Get one or many currencies from the Discoin network. */
	public static readonly currencies = currencyStore;
	/** Get one or many bots from the Discoin network. */
	public static readonly bots = botStore;
	/** Common queries customized for your bot. */
	public readonly commonQueries: CommonQueries;
	/** Update and get transactions. */
	public readonly transactions: TransactionStore;

	/**
	 * Create a Discoin client to interact with the Discoin API.
	 * @param token - The token to use for this client
	 * @param currencyIds - The currency IDs that your bot uses
	 */
	constructor(public token: Token, public currencyIds: string[]) {
		invariant(token !== undefined, 'token was undefined');
		invariant(currencyIds !== undefined, 'currencyIDs was undefined');
		invariant(
			typeof currencyIds !== 'string',
			['currencyID has been deprecated, you must pass an array of currencyIDs', `['${currencyIds as unknown as string}']`].join('\n'),
		);

		this.transactions = new TransactionStore(this);

		const relevantTransactionsFilter = `filter=to.id||$in||${currencyIds.map(currencyID => encodeURIComponent(currencyID.toUpperCase())).join(',')}`;

		this.commonQueries = {
			/* eslint-disable @typescript-eslint/naming-convention */
			RELEVANT_TRANSACTIONS: relevantTransactionsFilter,
			UNHANDLED_TRANSACTIONS: `${relevantTransactionsFilter}&filter=handled||$eq||false`,
			/* eslint-enable @typescript-eslint/naming-convention */
		};
	}
}
