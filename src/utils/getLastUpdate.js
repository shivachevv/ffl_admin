import { DATA_URL } from '../common'

const getLastUpdate = async () => {
    const response = await fetch(`${DATA_URL}lastUpdate.json`)
    const date = await response.json()
    return date

}

export default getLastUpdate