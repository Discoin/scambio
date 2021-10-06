import ky from 'ky-universal';
import {ApiBot, ApiGetManyDto} from '../types/api';
import {Bot} from '../types/discoin';
import {API_URL, USER_AGENT} from '../util/constants';
import {apiBotToBot, getManyResponseIsDto} from '../util/data-transfer-object';
import {invariant} from '../util/invariant';

// Hello welcome to the bot store what would you like to buy
/**
 * Store and retrieve many bots.
 */
export const botStore = {
	/**
	 * Get several bot from the API by specifying a query.
	 * @param query The query for finding bots
	 * @returns An array of bots that satisfy the query
	 * @example
	 * client.getMany('filter=id||eq||388191157869477888');
	 */
	async getMany(query?: string): Promise<Bot[] | ApiGetManyDto<Bot>> {
		const request = ky.get(`bots`, {
			prefixUrl: API_URL,
			headers: {'User-Agent': USER_AGENT},
			searchParams: query,
		});

		const response = await request;

		const getManyResponseJson = (await response.json()) as ApiBot[] | ApiGetManyDto<ApiBot>;

		if (getManyResponseIsDto(getManyResponseJson)) {
			return {...getManyResponseJson, data: getManyResponseJson.data.map(apiBot => apiBotToBot(apiBot))};
		}

		return getManyResponseJson.map(apiBot => apiBotToBot(apiBot));
	},

	/**
	 * Get one bot by ID.
	 * @param id The ID of the bot to get
	 * @returns The bot
	 */
	async getOne(id: string): Promise<Bot> {
		invariant(typeof id === 'string', "id wasn't string type");

		const request = ky.get(`bots/${encodeURIComponent(id)}`, {
			prefixUrl: API_URL,
			headers: {'User-Agent': USER_AGENT},
		});

		const response = await request;

		const apiBot = (await response.json()) as ApiBot;

		const bot = apiBotToBot(apiBot);

		return bot;
	},
};
