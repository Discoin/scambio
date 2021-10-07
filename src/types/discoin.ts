/**
 * A Discoin token to use for authenticating with Discoin.
 * @example c2ecfff55abd933dc375ad84dd1db0c1cee3bcd3e4d0e5bd412462bae1aeb1fc
 */
export type Token = string;

/**
 * A v4 UUID.
 * @example 04e00bae-f53d-429a-99c1-69de54d16d91
 */
export type UuidV4 = string;
/** @deprecated Renamed to `UuidV4`. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type UUIDv4 = UuidV4;

/**
 * A bot on the Discoin network.
 */
export interface Bot {
	/**
	 * The ID of this bot.
	 * This is a Discord user ID, but sometimes isn't.
	 * @example
	 * '388191157869477888'
	 */
	id: string;
	/** The currencies that correspond to this bot. */
	currencies: Currency[];
	/**
	 * The name of the bot.
	 * @example 'Dice'
	 */
	name: string;
}

/**
 * A currency on Discoin.
 */
export interface Currency {
	/**
	 * The shortened currency ID.
	 * @example 'OAT'
	 */
	id: string;
	/**
	 * The full currency name.
	 * @example 'Oats'
	 */
	name: string;
	/**
	 * The value in Discoin this currency is worth.
	 * @example 0.0401
	 */
	value: number;
	/**
	 * The reserve available of this currency.
	 * @example '1000.02'
	 */
	reserve: number;
	/**
	 * The worth in Discoin (WiD) of the currency.
	 * This is used to determine the `value` field.
	 * @example '1.02'
	 */
	wid: number;
}
