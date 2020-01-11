import ky from 'ky-universal';
import {APIPartialTransaction, APITransaction, APITransactionCreate} from '../types/api';
import {Currency, UUIDv4} from '../types/discoin';
import {API_URL, USER_AGENT, UUID_V4_REG_EXP} from '../util/constants';
import {Client} from './client';

/**
 * Options for updating a transaction that already exists.
 */
interface TransactionUpdateOptions {
	/** Whether or not the transaction is handled. */
	handled: boolean;
}

/**
 * Options for creating a transaction.
 */
interface TransactionCreateOptions {
	/**
	 * Currency ID to convert to.
	 * @example 'OAT'
	 */
	to: string;
	/**
	 * Amount in your bot's currency you are converting
	 * @example 100.23
	 */
	amount: number;
	/**
	 * Discord ID of the user who initiated the transaction.
	 * @example '210024244766179329'
	 */
	user: string;
}

/**
 * A transaction on the Discoin network.
 * A transaction converts one currency to another, using Discoin tokens as an intermediary currency.
 */
export class Transaction {
	public static readonly API_URL = API_URL;
	public readonly payout: number;
	public readonly amount: number;
	public readonly from: Pick<Currency, 'id' | 'name'> | Currency;
	public readonly to: Pick<Currency, 'id' | 'name'> | Currency;
	public readonly id: UUIDv4;
	public handled: boolean;
	public readonly user: string;
	public readonly timestamp: Date;
	private readonly _client: Client;

	/**
	 * Create a transaction or get one that already exists on Discoin.
	 * @param client The Discoin client to use for updating this transaction
	 * @param data The data for populating this transaction
	 */
	constructor(client: Client, data: APITransaction) {
		if (!UUID_V4_REG_EXP.test(data.id)) {
			throw new RangeError(`Transaction ID ${data.id} does not appear to be a valid v4 UUID`);
		}

		this._client = client;
		this.id = data.id;
		this.amount = parseFloat(data.amount);
		this.from = data.from;
		this.to = data.to;
		this.handled = data.handled;
		this.user = data.user;
		this.timestamp = new Date(data.timestamp);
		this.payout = data.payout;
	}

	/**
	 * Update this transaction.
	 * @param options Options to update this transaction
	 * @returns
	 */
	async update(options: TransactionUpdateOptions): Promise<this> {
		const req = ky.patch(`transactions/${encodeURIComponent(this.id)}`, {
			prefixUrl: API_URL,
			headers: {
				Authorization: `Bearer ${this._client.token}`,
				'User-Agent': `${USER_AGENT} ${this._client.currencyID}`
			},
			json: options
		});

		await req;

		this.handled = options.handled;
		return this;
	}
}

/**
 * Store and retrieve many transactions.
 */
export class TransactionStore {
	constructor(public client: Client) {}

	/**
	 * Get several transactions from the API by specifying a query.
	 * @param query The query for finding transactions
	 * @returns An array of transactions that satisfy the query
	 * @example
	 * client.getMany('filter=handled||eq||false');
	 */
	async getMany(query?: string): Promise<Transaction[]> {
		const req = ky(`transactions${query ? `?${query}` : ''}`, {
			prefixUrl: API_URL,
			headers: {'User-Agent': USER_AGENT}
		});

		const res = await req;

		const transactions: APIPartialTransaction[] = await res.json();

		return transactions.map(apiTransaction => new Transaction(this.client, apiTransaction));
	}

	/**
	 * Get one transaction by ID.
	 * @param id The ID of the transaction to get
	 * @returns The transaction
	 */
	async getOne(id: UUIDv4): Promise<Transaction> {
		if (!UUID_V4_REG_EXP.test(id)) {
			throw new RangeError(`Transaction ID ${id} does not appear to be a valid v4 UUID`);
		}

		const req = ky(`transactions/${encodeURIComponent(id)}`, {
			prefixUrl: API_URL,
			headers: {'User-Agent': USER_AGENT}
		});

		const res = await req;

		const apiTransaction: APIPartialTransaction = await res.json();

		return new Transaction(this.client, apiTransaction);
	}

	/**
	 * Create a new transaction.
	 * @param options Options for creating the transaction
	 * @returns The transaction that was created
	 */
	async create(options: TransactionCreateOptions): Promise<Transaction> {
		const json: APITransactionCreate = {
			amount: options.amount,
			toId: options.to,
			user: options.user
		};

		const req = ky.post('transactions', {
			prefixUrl: API_URL,
			headers: {Authorization: `Bearer ${this.client.token}`},
			json
		});

		const res = await req;

		const apiTransaction: APITransaction = await res.json();

		return new Transaction(this.client, apiTransaction);
	}
}
