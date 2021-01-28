const gk = {
    assists: 5,
    cleanSheet: 5,
    clearanceOffLine: 1,
    errorLeadToGoal: -1,
    goals: 10,
    lastManTackle: 0,
    manOfTheMatch: 3,
    ownGoals: -3,
    penaltyGoals: 4,
    penaltyMissed: -3,
    penaltySaved: 3,
    ratingOver85: 1,
    redCards: -3,
    saves: 1,
    shotsOnPost: 3,
    starter: 2,
    sub: 1,
    teamVictory: 1,
    threeAllowed: -2,
    yellowCards: -1
}
const def = {
    assists: 3,
    cleanSheet: 4,
    clearanceOffLine: 1,
    errorLeadToGoal: -1,
    goals: 7,
    lastManTackle: 1,
    manOfTheMatch: 3,
    ownGoals: -3,
    penaltyGoals: 4,
    penaltyMissed: -3,
    penaltySaved: 0,
    ratingOver85: 1,
    redCards: -3,
    saves: 0,
    shotsOnPost: 1,
    starter: 2,
    sub: 1,
    teamVictory: 1,
    threeAllowed: -1,
    yellowCards: -1
}
const mid = {
    assists: 3,
    cleanSheet: 1,
    clearanceOffLine: 1,
    errorLeadToGoal: -1,
    goals: 6,
    lastManTackle: 1,
    manOfTheMatch: 3,
    ownGoals: -3,
    penaltyGoals: 4,
    penaltyMissed: -3,
    penaltySaved: 0,
    ratingOver85: 1,
    redCards: -3,
    saves: 0,
    shotsOnPost: 1,
    starter: 2,
    sub: 1,
    teamVictory: 1,
    threeAllowed: 0,
    yellowCards: -1
}
const st = {
    assists: 3,
    cleanSheet: 0,
    clearanceOffLine: 1,
    errorLeadToGoal: -1,
    goals: 5,
    lastManTackle: 1,
    manOfTheMatch: 3,
    ownGoals: -3,
    penaltyGoals: 4,
    penaltyMissed: -3,
    penaltySaved: 0,
    ratingOver85: 1,
    redCards: -3,
    saves: 0,
    shotsOnPost: 1,
    starter: 2,
    sub: 1,
    teamVictory: 1,
    threeAllowed: 0,
    yellowCards: -1
}
const pointsCalculator = (
    position,
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
    yellowCards
    ) => {
        if (position === "GK") {
            return assists * gk.assists
            + cleanSheet * gk.cleanSheet
            + clearanceOffLine * gk.clearanceOffLine
            + errorLeadToGoal * gk.errorLeadToGoal
            + goals * gk.goals
            + lastManTackle * gk.lastManTackle
            + manOfTheMatch * gk.manOfTheMatch
            + ownGoals * gk.ownGoals
            + penaltyGoals * gk.penaltyGoals
            + penaltyMissed * gk.penaltyMissed
            + penaltySaved * gk.penaltySaved
            + ratingOver85 * gk.ratingOver85
            + redCards * gk.redCards
            + saves * gk.saves
            + shotsOnPost * gk.shotsOnPost
            + starter * gk.starter
            + sub * gk.sub
            + teamVictory * gk.teamVictory
            + threeAllowed * gk.threeAllowed
            + yellowCards * gk.yellowCards
        } else if (position === "DL" || position === "DC" || position === "DR") {
            return assists * def.assists
            + cleanSheet * def.cleanSheet
            + clearanceOffLine * def.clearanceOffLine
            + errorLeadToGoal * def.errorLeadToGoal
            + goals * def.goals
            + lastManTackle * def.lastManTackle
            + manOfTheMatch * def.manOfTheMatch
            + ownGoals * def.ownGoals
            + penaltyGoals * def.penaltyGoals
            + penaltyMissed * def.penaltyMissed
            + penaltySaved * def.penaltySaved
            + ratingOver85 * def.ratingOver85
            + redCards * def.redCards
            + saves * def.saves
            + shotsOnPost * def.shotsOnPost
            + starter * def.starter
            + sub * def.sub
            + teamVictory * def.teamVictory
            + threeAllowed * def.threeAllowed
            + yellowCards * def.yellowCards
        } else if (position === "ML" || position === "MC" || position === "MR") {
            return assists * mid.assists
            + cleanSheet * mid.cleanSheet
            + clearanceOffLine * mid.clearanceOffLine
            + errorLeadToGoal * mid.errorLeadToGoal
            + goals * mid.goals
            + lastManTackle * mid.lastManTackle
            + manOfTheMatch * mid.manOfTheMatch
            + ownGoals * mid.ownGoals
            + penaltyGoals * mid.penaltyGoals
            + penaltyMissed * mid.penaltyMissed
            + penaltySaved * mid.penaltySaved
            + ratingOver85 * mid.ratingOver85
            + redCards * mid.redCards
            + saves * mid.saves
            + shotsOnPost * mid.shotsOnPost
            + starter * mid.starter
            + sub * mid.sub
            + teamVictory * mid.teamVictory
            + threeAllowed * mid.threeAllowed
            + yellowCards * mid.yellowCards
        } else if (position === "ST") {
            return assists * st.assists
            + cleanSheet * st.cleanSheet
            + clearanceOffLine * st.clearanceOffLine
            + errorLeadToGoal * st.errorLeadToGoal
            + goals * st.goals
            + lastManTackle * st.lastManTackle
            + manOfTheMatch * st.manOfTheMatch
            + ownGoals * st.ownGoals
            + penaltyGoals * st.penaltyGoals
            + penaltyMissed * st.penaltyMissed
            + penaltySaved * st.penaltySaved
            + ratingOver85 * st.ratingOver85
            + redCards * st.redCards
            + saves * st.saves
            + shotsOnPost * st.shotsOnPost
            + starter * st.starter
            + sub * st.sub
            + teamVictory * st.teamVictory
            + threeAllowed * st.threeAllowed
            + yellowCards * st.yellowCards
        }
    }
    
    export default pointsCalculator