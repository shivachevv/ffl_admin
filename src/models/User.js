export const makeNewUser = (
    uid,
    email,
    name,
    userTeam,
    age,
    location,
    ocupation,
    favTeam,
    motto,
    code,
    isAdmin = false
) => {
    return {
        email,
        name,
        userTeam,
        userLogo: userTeam.toLowerCase().split(' ').join('-'),
        uid,
        age,
        location,
        ocupation,
        favTeam,
        motto,
        code,
        isAdmin,
        wildCards: {
            1: false,
            2: false
        },
        superCpt: {
            1: false,
            2: false
        }
    }
}

export const addUserRound = (team, transfersAvail, cpt, viceCpt, superCpt) => {
    return {
        superCpt,
        wildCard: false,
        cpt,
        viceCpt,
        team,
        transfersAvail,
        transfersMade: 0,
        nextRndInfo: {
            team: {},
            cpt: "",
            viceCpt: "",
            superCpt: ""
        }
    }
}