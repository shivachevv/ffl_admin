export default async function (d) {
    const removeDuplicates = (a, pos) => {
        return [...new Set(a.map(x => {
            return x[pos].toLowerCase().split(' ').join('_')
        }))]
    }


    const data = d.map(x => {
            return x.splice(0, x.length - 2)
        })
        .splice(1)

    // REMOVE DUPLICATE LEAGUE NAMES
    const leagues = removeDuplicates(data, 5)

    const teams = removeDuplicates(data, 1)

    const pos = ['gk', 'dc', 'dl', 'dr', 'mc', 'ml', 'mr', 'st']

    const players = data.map(x => {
        return {
            "league": x[5].toLowerCase().split(' ').join('_'),
            "team": x[1].toLowerCase().split(' ').join('_'),
            "name": x[2],
            "shirt": x[6],
            "pos": x[4],
            "league1": x[7],
            "league2": x[8],
            "league3": x[9],
            "total": x[10]
        }
    })
    console.log('1st before BIG LOOPS', new Date());

    const leagueObj = []


    leagues.forEach((a) => {
        let tmp1 = []
        let tmpO1 = {}

        teams.forEach(b => {
            let flag = false
            let tmp2 = []
            let tmpO2 = {}

            pos.forEach(c => {
                let tmp3 = []
                let tmpO3 = {}

                players.forEach(d => {
                    
                    if (a === d.league.toLowerCase().split(' ').join('_') &&
                        b === d.team.toLowerCase().split(' ').join('_') &&
                        c === d.pos.toLowerCase()) {
    
                        tmp3.push(d)
                    }
                    flag = tmp3.length ? true : false
                })

                tmpO3[c] = tmp3
                tmp2.push(tmpO3)
            })

            if (flag) {
                tmpO2[b] = tmp2
                tmp1.push(tmpO2)
            }
        })

        tmpO1[a] = tmp1
        leagueObj.push(tmpO1)

    })


    // console.log(leagueObj);
    


    // const leagueObj = leagues.map(a => {


    //     const tmp1 = teams.map(b => {
    //         let flag = false
    //         const tmp2 = pos.map(c => {
    //             let tmp3 = players.filter(d => {
    //                 return a === d.league.toLowerCase().split(' ').join('_') &&
    //                     b === d.team.toLowerCase().split(' ').join('_') &&
    //                     c === d.pos.toLowerCase()
    //             })
    //             flag = tmp3.length ? true : false
    //             return {
    //                 [c]: tmp3
    //             }
    //         })
    //         if (flag) {
    //             return {
    //                 [b]: tmp2
    //             }
    //         }

    //     })


    //     return {
    //         [a]: tmp1
    //     }
    // })

    console.log('2nd after BIG LOOPS', new Date());

    const tempObj = Object.assign({}, leagueObj)
    const result = {}

    for (const key in tempObj) {
        const element = tempObj[key];
        const lg = Object.keys(element)[0]
        result[lg] = element[lg]
    }

    console.log('3rd before return', new Date());

    return result
}