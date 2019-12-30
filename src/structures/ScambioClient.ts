import {ScambioTransaction, ApiTransaction} from './Transaction';
import fetch from 'node-fetch';
import {URL, URLSearchParams} from 'url';

class ScambioClient {
	/**
	 * The client's token
	 * @private
	*/
	public token: string;

	/**
	 * The client's currency code
	 * @readonly
	 */
	public currencyCode: string;

	/**
	 * The module's version. Cannot obtain it programmatically, so it's hardcoded
	 * @readonly
	 */
	public readonly version: string = '0.0.1';

	/**
	 * The endpoint which the client uses to contact your Discoin instance. Defaults to https://discoin.zws.im
	 * @readonly
	 */
	public readonly endpoint: string;

	/**
	 *
	 * @param token Your Discoin token
	 * @param currencyCode Your bot's currency code
	 * @param endpoint The endpoit you want to use. Defaults to https://discoin.zws.im
	 */
	constructor(token: string, currencyCode: string, endpoint?: string) {
		this.token = token;
		this.currencyCode = currencyCode;
		this.endpoint = typeof endpoint === 'undefined' ? 'https://discoin.zws.im' : endpoint;
	}

	/**
	 * Get a transaction by ID
	 * @param id The transaction's ID
	 * @async
	 */
	public async getTransaction(id: string): Promise<ScambioTransaction> {
		return await this._fetchTransactions(id) as ScambioTransaction;
	}

	/**
	 * Get all the transactions that are directed to the client's currency code
	 * @async
	 */
	public async getTransactions(): Promise<ScambioTransaction[]> {
		return await this._fetchTransactions(undefined, `to.id||eq||${this.currencyCode}`) as ScambioTransaction[];
	}

	/**
	 * Get all the **unhandled** transactions that are directed to the client's currency code
	 * @async
	 */
	public async getUnhandledTransactions(): Promise<ScambioTransaction[]> {
		return await this._fetchTransactions(undefined, ['handled||eq||false', `to.id||eq||${this.currencyCode}`]) as ScambioTransaction[];
	}

	public async createTransaction(amount: number, user: string, toCurrency: string): Promise<ScambioTransaction> {
		const data = await fetch(`${this.endpoint}/transactions`, {
			method: 'POST',
			headers: {
				'User-Agent': `Scambio v${this.version} (Discoin TS library) <https://github.com/cfanoulis/scambio)`,
				Authentication: `Bearer ${this.token}`
			},
			body: JSON.stringify({
				amount,
				user,
				toId: toCurrency
			})
		}).then(async response => response.json()) as ApiTransaction;
		return new ScambioTransaction(this, data);
	}

	/**
	 * Fetch transactions from the api
	 * @param id The transaction's ID
	 * @param filter A filter (or an array of them) to use.
	 * @private
	 */
	private async _fetchTransactions(id?: string, filter?: string | string[]): Promise<ScambioTransaction | ScambioTransaction[]> {
		if (id) {
			const data = await fetch(`${this.endpoint}/transactions/${id}`, {
				headers: {
					'User-Agent': `Scambio v${this.version} (Discoin TS library) <https://github.com/cfanoulis/scambio)`
				}
			}).then(async response => response.json()) as ApiTransaction;
			return new ScambioTransaction(this, data);
		}

		if (typeof filter === 'undefined') {
			const data = await fetch(`${this.endpoint}/transactions`, {
				headers: {
					'User-Agent': `Scambio v${this.version} (Discoin TS library) <https://github.com/cfanoulis/scambio)`
				}
			}).then(async response => response.json()) as ApiTransaction[];
			return data.map(data => new ScambioTransaction(this, data));
		}

		const url = new URL(`${this.endpoint}/transactions`);
		const queryIter = Array.isArray(filter) ? filter.map(filter => ['filter', filter]) : [['filter', filter]];
		url.search = new URLSearchParams(queryIter as Array<[string, string]>).toString();
		const data = await fetch(url, {
			headers: {
				'User-Agent': `Scambio v${this.version} (Discoin TS library) <https://github.com/cfanoulis/scambio)`
			}
		}).then(async response => response.json()) as ApiTransaction[];
		return data.map(data => new ScambioTransaction(this, data));
	}
}

export {ScambioClient};
