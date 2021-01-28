const leagues = ["33c46ff1-1756-41a1-a80f-01b2f4fb4b3c", "60e2f9e6-af52-4b5e-8918-94d9c79fd1c4"]

export const makeNewPlayer = (
    name, position, club, shirt, id, country
) => {
    return {
        name,
        position,
        club,
        shirt,
        id,
        country,
        available: {
            [leagues[0]]: true,
            [leagues[1]]: true
        }
    }
}

export const addPlayerPts = (
    roundPts,
    assists,
    cleanSheet,
    clearanceOffLine,
    errorLeadToGoal,
    goals,
    lastManTackle,
    manOfTheMatch,
    ownGoals,
    penaltyGoals,
    penaltyMissed,
    penaltySaved,
    ratingOver85,
    redCards,
    saves,
    shotsOnPost,
    starter,
    sub,
    teamVictory,
    threeAllowed,
    yellowCards,
) => {
    return {
        roundPts,
        "roundStats": {
            assists,
            cleanSheet,
            clearanceOffLine,
            errorLeadToGoal,
            goals,
            lastManTackle,
            manOfTheMatch,
            ownGoals,
            penaltyGoals,
            penaltyMissed,
            penaltySaved,
            ratingOver85,
            redCards,
            saves,
            shotsOnPost,
            starter,
            sub,
            teamVictory,
            threeAllowed,
            yellowCards,
        }
    }
}