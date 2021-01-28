const cupStandingsHelper = (cupData) => {
    let result = {}

    const sumPts = (team) => {
        const result = Object.values(team).reduce((acc, player) => {
            return player.pts + acc
        }, 0)

        return result
    }

    Object.keys(cupData).forEach(groupId => {
        const group = cupData[groupId]
        result[groupId] = {}
        Object.values(group.teams).forEach(team => {
            result[groupId][team] = {}
            result[groupId][team].for = 0
            result[groupId][team].against = 0
            result[groupId][team].goaldiff = 0
            result[groupId][team].games = 0
            result[groupId][team].pts = 0
            result[groupId][team].form = ''
            result[groupId][team].wdl = {
                win: 0,
                draw: 0,
                loss: 0
            }
        })

        Object.values(group.rounds).forEach(round => {

            Object.values(round).forEach(match => {
                if (typeof match === "object") {
                    let team1Total
                    let team2Total
                    if (match.team1.squad && match.team2.squad) {
                        Object.values(match).forEach((team, i) => {

                            const teamTotal = sumPts(team.squad)
                            if (i === 0) {
                                team1Total = teamTotal
                            } else {
                                team2Total = teamTotal
                            }
                        })
                        result[groupId][match.team1.id].games++
                        result[groupId][match.team2.id].games++

                        result[groupId][match.team1.id].for += team1Total
                        result[groupId][match.team1.id].against += team2Total

                        result[groupId][match.team2.id].for += team2Total
                        result[groupId][match.team2.id].against += team1Total

                        result[groupId][match.team1.id].goaldiff += team1Total - team2Total
                        result[groupId][match.team2.id].goaldiff += team2Total - team1Total

                        if (team1Total > team2Total) {
                            result[groupId][match.team1.id].pts += 3
                            result[groupId][match.team1.id].wdl.win++

                            result[groupId][match.team2.id].wdl.loss++

                            result[groupId][match.team1.id].form = result[groupId][match.team1.id].form + "W"
                            result[groupId][match.team2.id].form = result[groupId][match.team2.id].form + "L"
                        } else if (team2Total > team1Total) {
                            result[groupId][match.team2.id].pts += 3
                            result[groupId][match.team2.id].wdl.win++

                            result[groupId][match.team1.id].wdl.loss++

                            result[groupId][match.team2.id].form = result[groupId][match.team2.id].form + "W"
                            result[groupId][match.team1.id].form = result[groupId][match.team1.id].form + "L"
                        } else {
                            result[groupId][match.team1.id].pts++
                            result[groupId][match.team2.id].pts++

                            result[groupId][match.team2.id].wdl.draw++
                            result[groupId][match.team1.id].wdl.draw++

                            result[groupId][match.team1.id].form = result[groupId][match.team1.id].form + "D"
                            result[groupId][match.team2.id].form = result[groupId][match.team2.id].form + "D"
                        }
                    }

                }
            })

        })

    })

    return result
}

export default cupStandingsHelper