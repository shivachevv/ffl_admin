import { DATA_URL } from '../common'

const getAllCupGroups = async () => {
    const response = await fetch(`${DATA_URL}cup.json`)
    const cup = await response.json()

    return cup
}

export default getAllCupGroups