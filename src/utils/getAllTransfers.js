import { DATA_URL } from '../common'

 const getAllTransfers = async () => {
    const response = await fetch(`${DATA_URL}transfers.json`)
    const transfers = await response.json()
    return transfers
}

export default getAllTransfers