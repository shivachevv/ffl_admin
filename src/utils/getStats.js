import { DATA_URL } from '../common'

const getStats = async () => {
    const response = await fetch(`${DATA_URL}stats.json`, {
        method: "GET",
    })
    const stats = response.json()
    return stats
}

export default getStats