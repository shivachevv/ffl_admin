import { DATA_URL } from '../common'

const getAllLeagues = async () => {
    const response = await fetch(`${DATA_URL}leagues.json`)
    const leagues = await response.json()

    return leagues
}

export default getAllLeagues