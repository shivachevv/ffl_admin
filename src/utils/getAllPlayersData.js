import { DATA_URL } from '../common'
import getCachedPlayers from './getCachedPlayers.js'
// import { setLastUpdateCache } from './setLastUpdate.js'
import setPlayersCache from './setPlayersCache.js'

// import getLastUpdate from './getLastUpdate.js'
import axios from 'axios'
const lightPlayersUrl = `${DATA_URL}lightPlayers.json`

const getAllPlayersDataNormal = async () => {
    // const date = new Date()
    // await setLastUpdateDB(date)
    // const cache = await caches.open("ffl-cache");
    // cache.add("https://ffl-3-new.firebaseio.com/lastUpdate.json");
    // const lastUpdate = undefined



    // const lastUpdate = await getLastUpdate()
    // const cachedUpdate = await getCachedPlayers("update")

    // if (lastUpdate && cachedUpdate && lastUpdate === cachedUpdate) {
    //     console.log(1);
    //     const players = await getCachedPlayers('players')

    //     if (!players) {
    //         console.log(2);
    //         const response = await fetch(`${DATA_URL}players.json`)
    //         const players = await response.json()
    //         await setLastUpdateCache()
    //         await setPlayersCache('players')
    //         return players
    //     }

    //     return players
    // } else {

    //     console.log(2);

        const response = await fetch(`${DATA_URL}players.json`)
        const players = await response.json()

        // await setLastUpdateCache()
        // await setPlayersCache('players')

        return players
    // }
}

const getAllPlayersDataCathegorized = async () => {
    const response = await fetch(`${DATA_URL}players.json`)
    const normal = await response.json()
    let cathegorized = {}

    Object.keys(normal).forEach(id => {
        const player = normal[id]

        if (!cathegorized[player.country]) {
            cathegorized[player.country] = {}
            if (!cathegorized[player.country][player.club]) {
                cathegorized[player.country][player.club] = {}
                cathegorized[player.country][player.club][id] = player
            } else {
                cathegorized[player.country][player.club][id] = player
            }
        } else {
            if (!cathegorized[player.country][player.club]) {
                cathegorized[player.country][player.club] = {}
                cathegorized[player.country][player.club][id] = player
            } else {
                cathegorized[player.country][player.club][id] = player
            }
        }
    })

    return cathegorized
}

const cathegorizePlayers = (players) => {
    let cathegorized = {}

    Object.keys(players).forEach(id => {
        const player = players[id]

        if (!cathegorized[player.country]) {
            cathegorized[player.country] = {}
            if (!cathegorized[player.country][player.club]) {
                cathegorized[player.country][player.club] = {}
                cathegorized[player.country][player.club][id] = player
            } else {
                cathegorized[player.country][player.club][id] = player
            }
        } else {
            if (!cathegorized[player.country][player.club]) {
                cathegorized[player.country][player.club] = {}
                cathegorized[player.country][player.club][id] = player
            } else {
                cathegorized[player.country][player.club][id] = player
            }
        }
    })

    return cathegorized
}

const getAllLightPlayers = async () => {
    const etag = localStorage.getItem('lightPlayersETag')
    let headers = {}
    headers['X-Firebase-ETag'] = true
    if (etag) {
        headers["If-None-Match"] = etag;
    }

    try {
        const lightPlayers = await axios.get(lightPlayersUrl, {
            headers
        })
        console.log("load lightPlayers from DB1");

        const etag = lightPlayers.headers.etag;
        localStorage.setItem("lightPlayersETag", etag);

        setPlayersCache('lightPlayers')

        return lightPlayers.data
    } catch (error) {
        if (error && error.response.status === 304) {
            console.log("load players from CACHE");
            // const result = await getCachedUsers()
            
            const result = await getCachedPlayers('lightPlayers')

            if (!result) {
                const lightPlayers = await axios.get(lightPlayersUrl)

                const etag = lightPlayers.headers.etag;
                localStorage.setItem("lightPlayersETag", etag);

                console.log("load players from DB2");

                setPlayersCache('lightPlayers')

                return lightPlayers.data
            }

            return result
        }
    }
}

// const getAllLightPlayers = async () => {

//     const lastUpdate = await getLastUpdate()
//     const cachedUpdate = await getCachedPlayers("update")

//     if (lastUpdate && cachedUpdate && lastUpdate === cachedUpdate) {
//         console.log(11);
//         const players = await getCachedPlayers('light-players')

//         if (!players) {
//             console.log(22);
//             const response = await fetch(`${DATA_URL}lightPlayers.json`)
//             const players = await response.json()
//             await setLastUpdateCache()
//             await setPlayersCache('lightPlayers')
//             return players
//         }

//         return players
//     } else {

//         console.log(2);

//         const response = await fetch(`${DATA_URL}lightPlayers.json`)
//         const players = await response.json()

//         await setLastUpdateCache()
//         await setPlayersCache('lightPlayers')

//         return players
//     }
// }

export {
    getAllPlayersDataNormal,
    getAllPlayersDataCathegorized,
    cathegorizePlayers,
    getAllLightPlayers
}