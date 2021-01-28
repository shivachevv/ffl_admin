const roundPointsCalculator = (round, rndNum, players, isCup = false) => {
    const { cpt, viceCpt, superCpt } = round
    const roundIDs = round.team
    let total = 0
    // let hasCptPlayed
    // if (cpt) {
    //     hasCptPlayed = !!players[cpt].points[`r${rndNum}`].roundStats.starter || !!players[cpt].points[`r${rndNum}`].roundStats.sub
    // } else {
    //     hasCptPlayed = false
    // }

    // console.log(cpt, players[cpt]);
    // console.log(cpt, rndNum, players[cpt].points[`r${rndNum}`])
    const hasCptPlayed = cpt ?
        !!players[cpt].points[`r${rndNum}`].roundStats.starter || !!players[cpt].points[`r${rndNum}`].roundStats.sub
        :
        false

    const cptMultiplier = isCup ? 1 : superCpt ? 3 : 2

    Object.keys(roundIDs).forEach(pos => {
        const id = roundIDs[pos]
        if (id === cpt && hasCptPlayed) {
            total += players[id].points[`r${rndNum}`].roundPts * cptMultiplier
        } else if (id === viceCpt && !hasCptPlayed) {
            total += players[id].points[`r${rndNum}`].roundPts * cptMultiplier
        } else {
            if (players[id]) {
                total += players[id].points[`r${rndNum}`].roundPts
            }
        }
    })

    return total

}

export default roundPointsCalculator