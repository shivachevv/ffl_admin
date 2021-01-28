export default function (data, lg) {
    function returnLeague(x) {
        let lg = {
            'pele': 1,
            'maradona': 3
        }
        return lg[x]
    }

    function returnTeamNames(team) {
        let teams = {
            1: 'Eu4ia',
            2: 'Pinky and de Bruyne',
            3: 'The Asses',
            4: 'Retardisimos',
            5: 'Bianconero Londoneros',
            6: 'Cocky Caucasians',
            7: 'Kar6iaka Pedestrians',
            8: 'Smaky Team',
            9: 'Olympique Plovdiv',
            10: 'Bohemians',
            11: 'Cowpocalypse Now',
            12: 'Foolosophy Wanderers',
            13: 'Arbitragers',
            14: 'SS Lazio Chirpan',
            15: 'Zlodeite',
            16: 'Big Boys',
            17: 'Aquile FC',
            18: 'Cheloprachene',
            19: 'Thracian Separatists',
            20: 'Red Glory'
        }
        return teams[team]
    }

    function removeTakenPlayers(lenArr, arr) {
        return arr.slice(lenArr.length)
    }

    function addPlayersToArr(arr) {
        return arr.filter(x => {
            return x.pts === arr[0].pts
        })
    }

    let length = data[0].length - 2
    let tmp = data
        .slice(1)
        .filter(x => {
            return x[returnLeague(lg)] !== ''
        })
        .sort((a, b) => {
            return b[length] - a[length]
        }).map(x => {
            return {
                player: x[7],
                team: returnTeamNames(x[returnLeague(lg)]),
                pts: x[x.length - 2]
            }
        })

    let first = addPlayersToArr(tmp)

    tmp = removeTakenPlayers(first, tmp)
    let second = addPlayersToArr(tmp)

    tmp = removeTakenPlayers(second, tmp)
    let third = addPlayersToArr(tmp)

    return [first, second, third]
}