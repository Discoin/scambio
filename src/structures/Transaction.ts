import {ScambioClient} from './ScambioClient';
import fetch from 'node-fetch';

export class ScambioTransaction {
	/**
	 * The transaction's ID
	 */
	public readonly id: string;

	/**
	 * The transaction's original amount (as in, the amount the user paid)
	 */
	public readonly amount: string;

	/**
	 * The user's ID
	 */
	public readonly user: string;

	/**
	 * Whether this transaction has been processed
	 */
	public handled: boolean;

	/**
	 * The amount to be paid out
	 */
	public readonly payout: number;

	/**
	 * The bot this transaction originated from
	 */
	public readonly from: Bot;
	private readonly _timestamp: string;
	private readonly _client: ScambioClient;

	constructor(client: ScambioClient, data: ApiTransaction) {
		this.id = data.id;
		this.amount = data.amount;
		this.user = data.user;
		this.handled = data.handled;
		this._timestamp = data.timestamp;
		this.payout = data.payout;
		this.from = data.from;
		this._client = client;
	}

	/**
	 * Returns the transaction's timestamp
	 */
	public get timestamp(): Date {
		return new Date(this._timestamp);
	}

	/**
	 * Marks this transaction as processed, which means the amount has been paid out
	 * @async
	 */
	public async process(): Promise<this> {
		if (this.handled) {
			throw new Error('This transaction has been handled before.');
		}

		await fetch(`${this._client.endpoint}/transactions/${this.id}`, {
			method: 'PATCH',
			headers: {
				'User-Agent': `Scambio v${this._client.version} (Discoin TS library) <https://github.com/cfanoulis/scambio)`,
				Authentication: `Bearer ${this._client.token}`
			},
			body: JSON.stringify({
				handled: true
			})
		});
		this.handled = true;
		return this;
	}
}

export interface ApiTransaction {
	id: string;
	amount: string;
	user: string;
	handled: boolean;
	timestamp: string;
	payout: number;
	from: Bot;
	to: Bot;
}

interface Bot {
	id: string;
	name: string;
}
