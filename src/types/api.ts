import type {Except} from 'type-fest';
import type {Bot, Currency, UuidV4} from './discoin';

/**
 * @internal
 */
export interface ApiGetManyDto<T> {
	data: T[];
	count: number;
	total: number;
	page: number;
	pageCount: number;
}

/**
 * The default currency returned by the API, with some fields eagerly loaded.
 * @internal
 */
export type PartialCurrency = Pick<Currency, 'id' | 'name'> & {bot: Pick<Bot, 'name'> & {discord_id: string}};

/**
 * A Discoin transaction.
 * @internal
 */
export interface ApiTransaction {
	/** The transaction ID. */
	id: UuidV4;

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
 * @internal
 */
export interface ApiTransactionCreate extends Pick<ApiTransaction, 'user'> {
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
 * @internal
 */
export interface ApiCurrency extends Except<Currency, 'reserve' | 'wid'> {
	reserve: string;
	wid: string;
}

/**
 * A bot object from the API.
 * @internal
 */
export interface ApiBot extends Except<Bot, 'currencies'> {
	/** The currencies that correspond to this bot. */
	currencies: ApiCurrency[];
}

/**
 * An API error response body.
 * @example
 * ```js
 * {
 * 	statusCode: 401,
 * 	error: "Unauthorized"
 * }
 * ```
 * @example
 * ```js
 * {
 * 	statusCode: 404,
 * 	error: "Not Found",
 * 	message: "Cannot GET /"
 * }
 * ```
 * @internal
 */
export interface ApiErrorResponse {
	/** The HTTP status code of the response. */
	statusCode: number;
	/** HTTP status code error message */
	error: string;
	/** A description of what went wrong.  */
	message?: string;
}
