import ky from 'ky-universal';
import {Bot} from '../types/discoin';
import {API_URL, USER_AGENT} from '../util/constants';
import {APIBot, APIGetManyDTO} from '../types/api';
import {apiBotToBot, getManyResponseIsDTO} from '../util/data-transfer-object';

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
	async getMany(query?: string): Promise<Bot[]> {
		// Interpolation of query parameters here is almost certainly a mistake
		const req = ky.get(`bots${query ? `?${query}` : ''}`, {
			prefixUrl: API_URL,
			headers: {'User-Agent': USER_AGENT}
		});

		const res = await req;

		const getManyResponseJSON: APIBot[] | APIGetManyDTO<APIBot> = await res.json();

		const apiBots = getManyResponseIsDTO(getManyResponseJSON) ? getManyResponseJSON.data : getManyResponseJSON;

		const bots = apiBots.map(apiBot => apiBotToBot(apiBot));

		return bots;
	},

	/**
	 * Get one bot by ID.
	 * @param id The ID of the bot to get
	 * @returns The bot
	 */
	async getOne(id: string): Promise<Bot> {
		const req = ky.get(`bots/${encodeURIComponent(id)}`, {
			prefixUrl: API_URL,
			headers: {'User-Agent': USER_AGENT}
		});

		const res = await req;

		const apiBot: APIBot = await res.json();

		const bot = apiBotToBot(apiBot);

		return bot;
	}
};
