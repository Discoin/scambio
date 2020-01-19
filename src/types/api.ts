import {Bot, Currency, UUIDv4} from './discoin';

export interface APIGetManyDTO<T> {
	data: T[];
	count: number;
	total: number;
	page: number;
	pageCount: number;
}

/**
 * A Discoin transaction.
 */
export interface APITransaction {
	/** The transaction ID. */
	readonly id: UUIDv4;

	/** The currency this transaction is converting from. */
	readonly from: APICurrency;

	/** The currency this transaction is converting to. */
	readonly to: APICurrency;

	/**
	 * The amount in the `from` currency that this transcation is converting.
	 * This is a string type to preserve precision of decimal places.
	 * @example '1000'
	 */
	readonly amount: string;

	/**
	 * The Discord user ID of the user who initiated the transaction.
	 * @example '210024244766179329'
	 */
	readonly user: string;

	/**
	 * Whether or not this transaction was handled by the recipient bot.
	 * A transaction is handled when the recipient bot paid the respective user the correct amount in bot currency.
	 * Can only be updated by the recipient bot.
	 */
	readonly handled: boolean;

	/**
	 * Timestamp of when this transaction was initiated.
	 * @example '2019-12-09T12:28:50.231Z'
	 */
	readonly timestamp: string;

	/**
	 * How much the receiving bot should payout to the user who initiated the transaction.
	 * @example 500
	 */
	readonly payout: number;
}

/**
 * A request body sent to the API when creating a transaction.
 */
export interface APITransactionCreate extends Pick<APITransaction, 'user'> {
	/** Currency ID of the currency you are converting to. */
	readonly toId: string;
	/**
	 * The amount in the `from` currency that this transcation is converting.
	 * This can be a string type to preserve precision of decimal places.
	 * @example '1000.543297'
	 * @example 1000.24
	 */
	readonly amount: string | number;
}

/**
 * A currency object from the API.
 */
export interface APICurrency extends Omit<Currency, 'reserve'> {
	/**
	 * The reserve available of this currency.
	 * This is a string type to preserve precision of decimal places.
	 * @example '34435.52'
	 */
	readonly reserve: string;
}

/**
 * A bot object from the API.
 */
export interface APIBot extends Omit<Bot, 'currency'> {
	/** The currency that corresponds to this bot. */
	readonly currency: APICurrency;
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
	readonly statusCode: number;
	/** HTTP status code error message */
	readonly error: string;
	/** A description of what went wrong.  */
	readonly message?: string;
}
