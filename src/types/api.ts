import {Bot, Currency, UUIDv4} from './discoin';
import {Except} from 'type-fest';

export interface APIGetManyDTO<T> {
	data: T[];
	count: number;
	total: number;
	page: number;
	pageCount: number;
}

/** The default currency returned by the API, with some fields eagerly loaded. */
export type PartialCurrency = Pick<Currency, 'id' | 'name'> & {bot: Pick<Bot, 'name'> & {discord_id: string}};

/**
 * A Discoin transaction.
 */
export interface APITransaction {
	/** The transaction ID. */
	id: UUIDv4;

	/** The currency this transaction is converting from. */
	from: PartialCurrency;

	/** The currency this transaction is converting to. */
	to: PartialCurrency;

	/**
	 * The amount in the `from` currency that this transcation is converting.
	 * This is a string type to preserve precision of decimal places.
	 * @example '1000'
	 */
	amount: string;

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
export interface APITransactionCreate extends Pick<APITransaction, 'user'> {
	/** Currency ID of the currency you are converting from. */
	from: string;
	/** Currency ID of the currency you are converting to. */
	to: string;
	/**
	 * The amount in the `from` currency that this transcation is converting.
	 * This can be a string type to preserve precision of decimal places.
	 * @example '1000.543297'
	 * @example 1000.24
	 */
	amount: string | number;
}

/**
 * A currency object from the API.
 */
export interface APICurrency extends Except<Currency, 'reserve' | 'wid'> {
	reserve: string;
	wid: string;
}

/**
 * A bot object from the API.
 */
export interface APIBot extends Except<Bot, 'currencies'> {
	/** The currencies that correspond to this bot. */
	currencies: APICurrency[];
}

/**
 * An API error response body.
 * @example
 * {
 * 	statusCode: 401,
 * 	error: "Unauthorized"
 * }
 * @example
 * {
 * 	statusCode: 404,
 * 	error: "Not Found",
 * 	message: "Cannot GET /"
 * }
 */
export interface APIErrorResponse {
	/** The HTTP status code of the response. */
	statusCode: number;
	/** HTTP status code error message */
	error: string;
	/** A description of what went wrong.  */
	message?: string;
}
