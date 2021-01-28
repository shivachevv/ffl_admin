export default function (data1, data2, cpt, code) {

    // lastRnd ROUND OBJECT 

    function checkLg(c) {
        return c < 11 ? [1, 2] : [3, 4]
    }

    function lastRndRnd(d) {
        return d[0][d[0].length - 1]
    }

    function refractCptArr(arr, start, end) {
        return arr
            .map(x => x.slice(1))
            .map((x, i) => {
                return {
                    [i]: x.slice(1)
                }
            })
            .slice(start, end)
            .reduce(function (result, item) {
                let key = Object.keys(item)[0];
                result[key] = item[key];
                return result;
            }, {})
    }

    const cptArr = refractCptArr(cpt, 1, 21);
    const trippleArr = refractCptArr(cpt, 22, 43);
    
    function findCptforRnd(c, r) {
        return cptArr[c][r - 1]
    }

    function checkTrippleCpt(c, r) {
        return !!trippleArr[c + 22][r - 1]
    }

    function sumTotalPts(team) {
        return team.reduce((a, b) => {           
            return a + b.pts
        }, 0)
    }

    let lastRndRndTeam = data1
        .filter((x) => {
            return x[checkLg(code)[0]] === code
        })
        .map(x => {
            return x
                .slice(1, 10)
                .concat(x.slice(x.length - 1))

        })
        .map(x => {
            let pts = x[9] ? x[9] : 0;
            let isCpt = x[6] === findCptforRnd(code, lastRndRnd(data1))
            let isTripple = checkTrippleCpt(code, lastRndRnd(data1))
            pts = isCpt ? pts * 2 : pts;
            pts = isCpt && isTripple ? pts * 3 : pts
            return {
                name: x[6],
                pos: x[checkLg(code)[1] - 1],
                pts: pts,
                isCpt: isCpt,
                shirt: x[8]
            }
        })


    let lastRnd = {
        round: lastRndRnd(data1),
        team: lastRndRndTeam,
        tripple: checkTrippleCpt(code, lastRndRnd(data1)), // TO IMPLEMENT
        total: sumTotalPts(lastRndRndTeam)
    }


    //  WORK WITH THE HISTORY TAB

    let pos = (c, rnd) => {
        if (c < 11) {
            return [(rnd + 1) * 5 - 1, (rnd + 1) * 5 + 1, (rnd + 1) * 5 - 2] //   1. TEAM CODE   5. POSITION
        } else {
            return [(rnd + 1) * 5, (rnd + 1) * 5 + 2, (rnd + 1) * 5 - 2] //   2. TEAM CODE   6. POSITION
        }
    }

    let previousRounds = []
    for (let i = 0; i < lastRndRnd(data1); i++) {
        let rndCutter = pos(code, i)
        let team = []
        let isTripple = checkTrippleCpt(code, i);

        data2.forEach(x => {
            let isCpt = x[3] === findCptforRnd(code, i)
            let pts = x[rndCutter[2]] ? x[rndCutter[2]] : 0
            pts = isCpt ? pts * 2 : pts;
            pts = isCpt && isTripple ? pts * 3 : pts
            if (x[rndCutter[0]] === code) {
                let player = {
                    name: x[3],
                    pos: x[rndCutter[1]],
                    isCpt: isCpt,
                    pts: pts,
                    shirt: x[7]
                }
                team.push(player)
                
            }
        })

        if (team.length) {
            previousRounds.push({
                round: i,
                team: team,
                tripple: isTripple,
                total: sumTotalPts(team)
            })
        }       
    }


    return [...previousRounds, lastRnd]
}