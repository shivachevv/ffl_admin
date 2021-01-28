const isItFirstHalfSeason = (currentRound) => {
    const roundNum = Number(currentRound)
    const halfRound = 20
    
    if (roundNum < halfRound) {
        return true
    } else {
        return false
    }
}

export default isItFirstHalfSeason