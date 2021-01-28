import { DATA_URL } from '../common'
import axios from 'axios'
const cacheName = "ffl-cache"
const usersUrl = `${DATA_URL}users.json`

const getCachedUsers = async () => {
    const cache = await caches.open(cacheName);
    if (cache) {
        const usersResponse = await cache.match(usersUrl)
        if (!usersResponse) {
            return undefined
        }

        const users = await usersResponse.json()
        return users
    }
}

const setUsersCache = async () => {
    const cache = await caches.open("ffl-cache");
    cache.add(usersUrl);
    return
}

const getAllUsers = async () => {
    const etag = localStorage.getItem('usersETag')
    let headers = {}
    headers['X-Firebase-ETag'] = true
    if (etag) {
        headers["If-None-Match"] = etag;
    }

    try {
        const users = await axios.get(usersUrl, {
            headers
        })
        console.log("load users from DB1");

        const etag = users.headers.etag;
        localStorage.setItem("usersETag", etag);

        setUsersCache()

        return users.data
    } catch (error) {
        if (error && error.response.status === 304) {
            console.log("load users from CACHE");
            const result = await getCachedUsers()

            if (!result) {
                const users = await axios.get(usersUrl)

                console.log("load users from DB2");

                setUsersCache()

                return users.data
            }

            return result
        }
    }




    // const response = await fetch(`${DATA_URL}users.json`)
    // const users = await response.json()
    // return users
}




export default getAllUsers