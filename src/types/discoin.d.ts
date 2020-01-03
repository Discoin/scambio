/**
 * A Discoin token to use for authenticating with Discoin.
 * @example c2ecfff55abd933dc375ad84dd1db0c1cee3bcd3e4d0e5bd412462bae1aeb1fc
 */
export type Token = string;

/**
 * A v4 UUID.
 * @example 04e00bae-f53d-429a-99c1-69de54d16d91
 */
export type UUIDv4 = string;

/**
 * A bot on the Discoin network.
 */
export interface Bot {
	/**
	 * The ID of this bot.
	 * This is usually a Discord user ID, but sometimes isn't.
	 * @example
	 * '388191157869477888'
	 * @example
	 * '496480755728384002_DUTC'
	 */
	readonly id: string;
	/** The currency that corresponds to this bot. */
	readonly currency: Currency;
}

/**
 * A currency on Discoin.
 */
export interface Currency {
	/**
	 * The shortened currency ID.
	 * @example 'OAT'
	 */
	readonly id: string;
	/**
	 * The full currency name.
	 * @example 'Dice Oats'
	 */
	readonly name: string;
	/**
	 * The value in Discoin this currency is worth.
	 * @example 0.1
	 */
	readonly value: number;
	/**
	 * The reserve available of this currency.
	 * @example 9999889.021
	 */
	readonly reserve: number;
}
