import { setCachedResource, getCachedResource } from './cacheFunctions'
import { DATA_URL } from '../../common'
import axios from 'axios'

const loadResource = async (type) => {
    const resourseUrl = `${DATA_URL}${type}.json`

    const etag = localStorage.getItem(`${type}Etag`)
    let headers = {}
    headers['X-Firebase-ETag'] = true
    if (etag) {
        headers["If-None-Match"] = etag;
    }

    try {
        const response = await axios.get(resourseUrl, {
            headers
        })
        console.log(`load ${type} from DB1`);

        const etag = response.headers.etag;
        localStorage.setItem(`${type}Etag`, etag);

        setCachedResource(type)

        return response.data
    } catch (error) {
        if (error && error.response.status === 304) {
            console.log(`load ${type} from CACHE`);
            const result = await getCachedResource(type)

            if (!result) {
                const response = await axios.get(resourseUrl)

                const etag = response.headers.etag;
                localStorage.setItem(`${type}Etag`, etag);

                console.log(`load ${type} from DB2`);

                setCachedResource(type)

                return response.data
            }

            return result
        }
    }
}

export default loadResource