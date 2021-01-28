import { getCurrentRound } from "../utils/getCurrentRound";
import getMatching from "../utils/getMatching";
import pointsCalculator from '../utils/pointsCalculator'

const syncPointsHelper = async (pts, players, id) => {
    const round = id ? id : await getCurrentRound()

    const playersMapped = await getMatching()
    Object.keys(pts).forEach(id => {
        if (playersMapped[id]) {
            const mappedID = playersMapped[id]
            const playerStats = {
                assists: pts[id].assists ? pts[id].assists : 0,
                cleanSheet: pts[id].cleanSheet ? pts[id].cleanSheet : 0,
                clearanceOffLine: pts[id].clearanceOffLine ? pts[id].clearanceOffLine : 0,
                errorLeadToGoal: pts[id].errorLeadToGoal ? pts[id].errorLeadToGoal : 0,
                goals: pts[id].goals ? pts[id].goals : 0,
                lastManTackle: pts[id].lastManTackle ? pts[id].lastManTackle : 0,
                manOfTheMatch: pts[id].manOfTheMatch ? pts[id].manOfTheMatch : 0,
                ownGoals: pts[id].ownGoals ? pts[id].ownGoals : 0,
                penaltyGoals: pts[id].penaltyGoals ? pts[id].penaltyGoals : 0,
                penaltyMissed: pts[id].penaltyMissed ? pts[id].penaltyMissed : 0,
                penaltySaved: pts[id].penaltySaved ? pts[id].penaltySaved : 0,
                ratingOver85: pts[id].ratingOver85 ? pts[id].ratingOver85 : 0,
                redCards: pts[id].redCards ? pts[id].redCards : 0,
                saves: pts[id].saves ? pts[id].saves : 0,
                shotsOnPost: pts[id].shotsOnPost ? pts[id].shotsOnPost : 0,
                starter: pts[id].starter ? pts[id].starter : 0,
                sub: pts[id].sub ? pts[id].sub : 0,
                teamVictory: pts[id].teamVictory ? pts[id].teamVictory : 0,
                threeAllowed: pts[id].threeAllowed ? pts[id].threeAllowed : 0,
                yellowCards: pts[id].yellowCards ? pts[id].yellowCards : 0
            }

            if (players[mappedID]) {
                const { position } = players[mappedID]
                const roundPts = pointsCalculator(
                    position,
                    ...Object.values(playerStats)
                )

                players[mappedID].points[`r${round}`] = {
                    roundPts,
                    roundStats: playerStats
                }
            }
        }
    })

    return players
}

export default syncPointsHelper


