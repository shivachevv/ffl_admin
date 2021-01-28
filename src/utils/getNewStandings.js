import { DATA_URL } from '../common'

const getNewStandings = async () => {
    const response = await fetch(`${DATA_URL}newstandings.json`)
    const standings = await response.json()
    return standings

}

export default getNewStandings