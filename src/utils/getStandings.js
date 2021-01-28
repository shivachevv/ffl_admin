import { DATA_URL } from '../common'

const getStandings = async () => {
    const response = await fetch(`${DATA_URL}standings.json`)
    const standings = await response.json()
    return standings

}

export default getStandings