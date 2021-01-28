import { API_URL } from '../common'

const updateLightPlayers = async () => {
    await fetch(`${API_URL}players/light-upload`, {
        method: "GET",
    })

    return
}

export default updateLightPlayers