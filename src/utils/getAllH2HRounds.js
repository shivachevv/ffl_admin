import { DATA_URL } from '../common'

const getAllH2HRounds = async () => {
    const response = await fetch(`${DATA_URL}h2h.json`)
    const rounds = await response.json()

    return rounds
}

export default getAllH2HRounds