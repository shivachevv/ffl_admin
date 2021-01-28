import roundPointsCalculator from '../utils/roundPointsCalculator'

const standingsH2HHelper = (rounds, players, users, currentRound) => {
    const newTeamObj = () => {
        return {
            for: 0,
            against: 0,
            goaldiff: 0,
            games: 0,
            pts: 0,
            form: '',
            wdl: {
                win: 0,
                draw: 0,
                loss: 0
            }
        }
    }
    let result = {}
    // const totalRounds = Object.values(rounds).length
    Object.values(rounds)
        .sort((a, b) => {
            const roundA = Number(a.name.substring(1,3))
            const roundB = Number(b.name.substring(1,3))
            return roundA - roundB
        })
        .forEach(round => {
            // console.log(i, totalRounds);
            // const isInForm = i > totalRounds - 4
            const roundHeld = Object.values(round)[2]
            const roundObject = Object.values(round)[0]
            const roundArray = Object.values(roundObject)
            if (roundHeld <= currentRound) {
                roundArray.forEach(matches => {
                    const user1 = matches.team1
                    const user2 = matches.team2
                    if (!result[user1]) {
                        result[user1] = newTeamObj()
                    }
                    if (!result[user2]) {
                        result[user2] = newTeamObj()
                    }

                    const userRound1 = users[user1].rounds[`r${roundHeld}`]
                    const userRound2 = users[user2].rounds[`r${roundHeld}`]

                    const team1Total = roundPointsCalculator(userRound1, roundHeld, players, true)
                    const team2Total = roundPointsCalculator(userRound2, roundHeld, players, true)


                    // console.log(round, matches, user1, user2, result)
                    if (team1Total !== 0 && team2Total !== 0) {
                        result[user1].games++
                        result[user2].games++

                        result[user1].for += team1Total
                        result[user1].against += team2Total

                        result[user2].for += team2Total
                        result[user2].against += team1Total

                        result[user1].goaldiff += team1Total - team2Total
                        result[user2].goaldiff += team2Total - team1Total

                        if (team1Total > team2Total) {
                            result[user1].pts += 3
                            result[user1].wdl.win++

                            result[user2].wdl.loss++
                            result[user1].form = result[user1].form + "W"
                            result[user2].form = result[user2].form + "L"

                        } else if (team2Total > team1Total) {
                            result[user2].pts += 3
                            result[user2].wdl.win++

                            result[user1].wdl.loss++
                            result[user2].form = result[user2].form + "W"
                            result[user1].form = result[user1].form + "L"

                        } else {
                            result[user1].pts++
                            result[user2].pts++

                            result[user2].wdl.draw++
                            result[user1].wdl.draw++

                            result[user1].form = result[user1].form + "D"
                            result[user2].form = result[user2].form + "D"
                        }
                    }

                    result[user1].form = result[user1].form.substring(result[user1].form.length - 5)
                    result[user2].form = result[user2].form.substring(result[user2].form.length - 5)

                })
            }

        })


    return result
}

export default standingsH2HHelper