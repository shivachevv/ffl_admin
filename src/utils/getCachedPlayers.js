import { DATA_URL } from '../common'
const cacheName = "ffl-cache"
const lastUpdateUrl = `${DATA_URL}lastUpdate.json`
const playersUrl = `${DATA_URL}players.json`
const lightPlayersUrl = `${DATA_URL}lightPlayers.json`

const urls = {
    "update": lastUpdateUrl,
    "players": playersUrl,
    "lightPlayers": lightPlayersUrl,
}

const getCachedPlayers = async (type) => {
    const cache = await caches.open(cacheName);
    if (cache) {
        const response = await cache.match(urls[type])
        if (!response) {
            return undefined
        }
        const jsonResponse = await response.json()
        return jsonResponse

        // if (type === "update") {
        //     const lastUpdateResponse = await cache.match(lastUpdateUrl)
        //     if (!lastUpdateResponse) {
        //         return undefined
        //     }
        //     const lastUpdate = await lastUpdateResponse.json()
        //     return lastUpdate
        // }
        // if (type === "players") {
        //     const playersResponse = await cache.match(playersUrl)
        //     if (!playersResponse) {
        //         return undefined
        //     }

        //     const players = await playersResponse.json()
        //     return players
        // }
        // if (type === "light-players") {
        //     const playersResponse = await cache.match(lightPlayersUrl)
        //     if (!playersResponse) {
        //         return undefined
        //     }

        //     const players = await playersResponse.json()
        //     return players
        // }
    }
}

export default getCachedPlayers
