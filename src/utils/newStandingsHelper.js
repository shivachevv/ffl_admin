import roundPointsCalculator from './roundPointsCalculator'

const newStandingsHelper = (players, users, leagues, currentRound, arePtsEmpty) => {

    const makeStandingsWithPlaces = (standings) => {
        let result = JSON.parse(JSON.stringify(standings))

        Object.entries(result).forEach(league => {
            const leagueId = league[0]
            const leagueArr = Object.entries(league[1])
            leagueArr
                .sort((a, b) => {
                    return b[1].total - a[1].total
                })
                .forEach((x, i) => {
                    result[leagueId][x[0]].place = i + 1
                })
        })
        return result
    }

    const makeStandings = (players, users, leagues, roundToTake) => {
        const isFirstRnd = Number(roundToTake) === 1
        let result = {}

        Object.keys(leagues).forEach(leagueId => {
            const teams = leagues[leagueId].teams
            teams.forEach(userId => {
                const rounds = users[userId].rounds


                const total = Object.keys(rounds).reduce((acc, roundId) => {
                    const round = rounds[roundId]
                    const roundNum = Number(roundId.substring(1))
                    const roundTotal = roundPointsCalculator(round, roundNum, players, false)

                    if (roundNum <= roundToTake) {
                        return roundTotal + acc
                    } else {
                        return acc
                    }
                }, 0)

                const lastRndTotal = isFirstRnd ?
                    0
                    :
                    arePtsEmpty ?
                        roundPointsCalculator(rounds[`r${roundToTake}`], roundToTake, players, false)
                        :
                        roundPointsCalculator(rounds[`r${roundToTake - 1}`], roundToTake - 1, players, false)

                const thisRndTotal = arePtsEmpty ?
                    0
                    :
                    roundPointsCalculator(rounds[`r${roundToTake}`], roundToTake, players, false)

                if (result[leagueId]) {
                    result[leagueId][userId] = {
                        total,
                        lastRndTotal,
                        thisRndTotal
                    }
                } else {
                    result[leagueId] = {}
                    result[leagueId][userId] = {
                        total,
                        lastRndTotal,
                        thisRndTotal
                    }
                }

            })
        })
        return result
    }

    const addMovement = (newStandings, oldStandings, roundToTake) => {
        let result = JSON.parse(JSON.stringify(newStandings))
        const isFirstRnd = Number(roundToTake) === 1

        Object.entries(result).forEach(league => {
            const leagueId = league[0]
            const leagueArr = Object.entries(league[1])
            leagueArr
                .forEach(x => {
                    if (!isFirstRnd) {
                        if (arePtsEmpty) {
                            result[leagueId][x[0]].movement = 0
                        } else {
                            result[leagueId][x[0]].movement = oldStandings[leagueId][x[0]].place - newStandings[leagueId][x[0]].place
                        }
                        // const previousRound = oldStandings[`r${currentRound - 1}`]
                        // // console.log(2);

                        // if (!previousRound) {
                        // } else {
                        // result[leagueId][x[0]].movement = previousRound[leagueId][x[0]].place - result[leagueId][x[0]].place
                        // }

                        // console.log(3);

                    } else {
                        result[leagueId][x[0]].movement = 0
                    }
                })
        })

        return result
    }

    const newStandings = makeStandings(players, users, leagues, currentRound)
    const oldStandings = makeStandings(players, users, leagues, currentRound - 1)

    const newStandingsWithPlaces = makeStandingsWithPlaces(newStandings)
    const oldStandingsWithPlaces = makeStandingsWithPlaces(oldStandings)

    const readyStandings = addMovement(newStandingsWithPlaces, oldStandingsWithPlaces, currentRound)

    return readyStandings
}

export default newStandingsHelper
