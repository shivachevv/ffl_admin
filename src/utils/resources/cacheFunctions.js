// import { DATA_URL } from '../../common'
const cacheName = "ffl-cache"
// const lastUpdateUrl = `${DATA_URL}lastUpdate.json`
// const playersUrl = `${DATA_URL}players.json`
// const lightPlayersUrl = `${DATA_URL}lightPlayers.json`


const getCachedResource = async (type) => {
    // const url = `${DATA_URL}${type}.json`
    const url = type

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

const setCachedResource = async (type, data) => {
    const cache = await caches.open("ffl-cache");
    const dataString = JSON.stringify(data)
    try {
        cache.put(type, new Response(dataString))
    } catch (error) {
        console.log(error);
    }
    return
}

export { getCachedResource, setCachedResource }
