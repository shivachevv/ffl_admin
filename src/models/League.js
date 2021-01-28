const makeNewLeague = (
    id,
    name,
    teams
) => {
    return {
        id,
        name,
        logoSmall: name.toLowerCase() + '-small',
        logoActive: name.toLowerCase() + '-active',
        logoBig: name.toLowerCase() + '-big',
        teams
    }
}

export default makeNewLeague