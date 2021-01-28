import { DATA_URL } from '../common'

export const getPointsFromTool = async (isLeague) => {
    const response = await fetch(`${DATA_URL}pointsSync/points.json`)
    const points = await response.json()

    if (points !== null) {
        const result = {}
        if (isLeague) {
            Object.values(points).forEach(team => {
                const playerIds = Object.keys(team.players)
                playerIds.forEach(id => {
                    result[id] = team.players[id]
                })
            })
        } else {
            Object.values(points).forEach(league => {
                const teams = Object.values(league.teams)
                teams.forEach(team => {
                    const playerIds = Object.keys(team.players)
                    playerIds.forEach(id => {
                        result[id] = team.players[id]
                    })
                })
            })
        }

        return result
    } else {
        return 'empty'
    }

}