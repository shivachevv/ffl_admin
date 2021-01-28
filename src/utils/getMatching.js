import { DATA_URL } from '../common'

 const getMatching = async () => {
    const response = await fetch(`${DATA_URL}matching.json`)
    const matching = await response.json()
    return matching
}

export default getMatching