import {Bot, Currency, UUIDv4} from './discoin';

/**
 * A Discoin transaction.
 */
export interface APITransaction {
	/** The transaction ID. */
	id: UUIDv4;

	/** The currency this transaction is converting from. */
	from: Pick<Currency, 'id' | 'name'> | Currency;

	/** The currency this transaction is converting to. */
	to: Pick<Currency, 'id' | 'name'> | Currency;

	/**
	 * The amount in the `from` currency that this transcation is converting.
	 * @example 1000
	 */
	amount: number;

	/**
	 * The Discord user ID of the user who initiated the transaction.
	 * @example '210024244766179329'
	 */
	user: string;

	/**
	 * Whether or not this transaction was handled by the recipient bot.
	 * A transaction is handled when the recipient bot paid the respective user the correct amount in bot currency.
	 * Can only be updated by the recipient bot.
	 */
	handled: boolean;

	/**
	 * Timestamp of when this transaction was initiated.
	 * @example '2019-12-09T12:28:50.231Z'
	 */
	timestamp: string;

	/**
	 * How much the receiving bot should payout to the user who initiated the transaction.
	 * @example 500
	 */
	payout: number;
}

/**
 * A request body sent to the API when creating a transaction.
 */
export interface APITransactionCreate extends Pick<APITransaction, 'amount' | 'user'> {
	/** Currency ID of the currency you are converting to. */
	toId: string;
}

/**
 * A transaction object from the API.
 */
export interface APIPartialTransaction extends Omit<APITransaction, 'from' | 'to'> {
	/** Partial currency that just contains the ID and name. */
	from: Pick<Currency, 'id' | 'name'>;

	/** Partial currency that just contains the ID and name. */
	to: Pick<Currency, 'id' | 'name'>;
}

/**
 * A currency object from the API.
 */
export interface APICurrency extends Omit<Currency, 'value'> {
	/**
	 * The value of this currency.
	 * For whatever reason the API returns this as a string.
	 * @example '0.1'
	 */
	value: string;
}

/**
 * A bot object from the API.
 */
export interface APIBot extends Omit<Bot, 'currency'> {
	/** The currency that corresponds to this bot. */
	currency: APICurrency;
}
