import {Token} from '../types/discoin';
import {TransactionStore} from './transactions';
import {currencyStore} from './currencies';
import {botStore} from './bots';

/**
 * Common queries to use for `getMany` operations.
 */
interface CommonQueries {
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
	public static currencies = currencyStore;
	/** Get one or many bots from the Discoin network. */
	public static bots = botStore;
	/** Common queries customized for your bot. */
	public commonQueries: CommonQueries;
	/** Update and get transactions. */
	public transactions: TransactionStore;

	/**
	 * Create a Discoin client to interact with the Discoin API.
	 * @param token The token to use for this client
	 * @param currencyID The currency ID that your bot uses
	 */
	constructor(public token: Token, public currencyID: string) {
		this.transactions = new TransactionStore(this);

		const relevantTransactionsFilter = `filter=to.id||eq||${currencyID}`;

		this.commonQueries = {
			RELEVANT_TRANSACTIONS: relevantTransactionsFilter,
			UNHANDLED_TRANSACTIONS: `${relevantTransactionsFilter}&filter=handled||eq||false`
		};
	}
}
