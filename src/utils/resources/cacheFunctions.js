import { DATA_URL } from '../../common'
const cacheName = "ffl-cache"
// const lastUpdateUrl = `${DATA_URL}lastUpdate.json`
// const playersUrl = `${DATA_URL}players.json`
// const lightPlayersUrl = `${DATA_URL}lightPlayers.json`


const getCachedResource = async (type) => {
    const url = `${DATA_URL}${type}.json`

    const cache = await caches.open(cacheName);
    if (cache) {
        const response = await cache.match(url)
        if (!response) {
            return undefined
        }
        const jsonResponse = await response.json()
        return jsonResponse
    }
}

const setCachedResource = async (type) => {
    const cache = await caches.open("ffl-cache");
    cache.add(`${DATA_URL + type}.json`);
    return
}

export { getCachedResource, setCachedResource }
