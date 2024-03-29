import ky from 'ky-universal';
import type {Except} from 'type-fest';
import type {ApiGetManyDto, ApiTransaction, ApiTransactionCreate, PartialCurrency} from '../types/api';
import type {UuidV4} from '../types/discoin';
import {API_URL, USER_AGENT, UUID_V4_REG_EXP} from '../util/constants';
import {getManyResponseIsDto} from '../util/data-transfer-object';
import {invariant} from '../util/invariant';
import type {Client} from './client';

/**
 * Options for updating a transaction that already exists.
 */
export interface TransactionUpdateOptions {
	/** Whether or not the transaction is handled. */
	handled: boolean;
}

/**
 * Options for creating a transaction.
 */
export interface TransactionCreateOptions {
	/**
	 * Currency ID to convert to.
	 * @example 'OAT'
	 */
	to: string;
	/**
	 * Currency ID to convert from.
	 * @example 'OAT'
	 */
	from: string;
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
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static readonly API_URL = API_URL;
	public readonly payout: number;
	public readonly amount: number;
	public readonly from: PartialCurrency;
	public readonly to: PartialCurrency;
	public readonly id: UuidV4;
	public handled: boolean;
	public readonly user: string;
	public readonly timestamp: Date;
	private readonly _client: Client;

	/**
	 * Create a transaction or get one that already exists on Discoin.
	 * @param client - The Discoin client to use for updating this transaction
	 * @param data - The data for populating this transaction
	 */
	constructor(client: Client, data: ApiTransaction | Except<Transaction, 'update'>) {
		if (!UUID_V4_REG_EXP.test(data.id)) {
			throw new RangeError(`Transaction ID ${data.id} does not appear to be a valid v4 UUID`);
		}

		this._client = client;
		this.id = data.id;
		this.amount = typeof data.amount === 'string' ? Number(data.amount) : data.amount;
		this.from = data.from;
		this.to = data.to;
		this.handled = data.handled;
		this.user = data.user;
		this.timestamp = data.timestamp instanceof Date ? data.timestamp : new Date(data.timestamp);
		this.payout = data.payout;
	}

	/**
	 * Update this transaction.
	 * @param options - Options to update this transaction
	 * @returns The transaction that was just updated
	 */
	async update(options: TransactionUpdateOptions): Promise<this> {
		invariant(options, "Update options weren't provided");

		const request = ky.patch(`transactions/${encodeURIComponent(this.id)}`, {
			prefixUrl: API_URL,
			headers: {
				Authorization: `Bearer ${this._client.token}`,
				'User-Agent': USER_AGENT,
			},
			json: options,
		});

		await request;

		this.handled = options.handled;
		return this;
	}
}

/**
 * Store and retrieve many transactions.
 */
export class TransactionStore {
	constructor(public readonly client: Client) {}

	/**
	 * Get several transactions from the API by specifying a query.
	 * @param query - The query for finding transactions
	 * @returns An array of transactions that satisfy the query
	 * @example
	 * client.getMany('filter=handled||eq||false');
	 */
	async getMany(query?: string): Promise<Transaction[] | ApiGetManyDto<Transaction>> {
		const request = ky(`transactions`, {
			prefixUrl: API_URL,
			headers: {'User-Agent': USER_AGENT},
			searchParams: query,
		});

		const response = await request;

		const getManyResponseJson = (await response.json()) as ApiTransaction[] | ApiGetManyDto<ApiTransaction>;

		if (getManyResponseIsDto(getManyResponseJson)) {
			return {
				...getManyResponseJson,
				data: getManyResponseJson.data.map(apiTransaction => new Transaction(this.client, apiTransaction)),
			};
		}

		return getManyResponseJson.map(apiTransaction => new Transaction(this.client, apiTransaction));
	}

	/**
	 * Get one transaction by ID.
	 * @param id - The ID of the transaction to get
	 * @returns The transaction
	 */
	async getOne(id: UuidV4): Promise<Transaction> {
		invariant(typeof id === 'string', "id wasn't string type");

		if (!UUID_V4_REG_EXP.test(id)) {
			throw new RangeError(`Transaction ID ${id} does not appear to be a valid v4 UUID`);
		}

		const request = ky(`transactions/${encodeURIComponent(id)}`, {
			prefixUrl: API_URL,
			headers: {'User-Agent': USER_AGENT},
		});

		const response = await request;

		const apiTransaction = (await response.json()) as ApiTransaction;

		return new Transaction(this.client, apiTransaction);
	}

	/**
	 * Create a new transaction.
	 * @param options - Options for creating the transaction
	 * @returns The transaction that was created
	 */
	async create(options: TransactionCreateOptions): Promise<Transaction> {
		const json: ApiTransactionCreate = {
			amount: options.amount,
			to: options.to,
			from: options.from,
			user: options.user,
		};

		const request = ky.post('transactions', {
			prefixUrl: API_URL,
			headers: {Authorization: `Bearer ${this.client.token}`},
			json,
		});

		const response = await request;

		const apiTransaction = (await response.json()) as ApiTransaction;

		return new Transaction(this.client, apiTransaction);
	}
}
