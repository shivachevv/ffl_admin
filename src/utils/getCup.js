import { DATA_URL } from '../common'

const getCup = async () => {
    const response = await fetch(`${DATA_URL}cup.json`)
    const cup = await response.json()
    return cup

}

export default getCup