import { DATA_URL } from '../common'

export const getCurrentRound = async () => {
    const response = await fetch(`${DATA_URL}round.json`)
    const round = await response.json()

    return round.currentRound
}

export const setNewRound = async (newValue) => {
    const payload = {
        currentRound: newValue
    }
    const newRoundRq = await fetch(`${DATA_URL}round.json`, {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    const round = await newRoundRq.json()

    return round.currentRound
}