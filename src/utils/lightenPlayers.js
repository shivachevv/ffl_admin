// import { DATA_URL } from '../common'
// import store from '../store/index.js'
import getAllUsers from '../utils/getAllUsers'

const lightenPlayers = async (players, users) => {
    if (!users) {
        users = await getAllUsers()
    }
    const a = new Date().getTime()

    const teams = Object.values(users).map(x => {
        return x.rounds
    })
        .map(x => {
            return Object.values(x)
        })
        .flat()
        .map(x => {
            return Object.values(x.team)
        })
        .flat()

    const uniqueTeamPlayers = [...new Set(teams)];

    let result = {}

    Object.keys(players).forEach(id => {
        const isActive = uniqueTeamPlayers.includes(id)

        if (isActive) {
            result[id] = players[id]
        } else {
            let copy = JSON.parse(JSON.stringify(players[id]))

            for (const key in copy.points) {
                copy.points[key].roundStats = ''
            }

            result[id] = copy
            
        }

    })
    const b = new Date().getTime()
    console.log(b - a);
    return result
}

export default lightenPlayers