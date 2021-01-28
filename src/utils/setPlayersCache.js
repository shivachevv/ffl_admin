import { DATA_URL } from '../common'

const setPlayersCache = async (type) => {
    const cache = await caches.open("ffl-cache");
    cache.add(`${DATA_URL + type}.json`);
    return
} 

export default setPlayersCache