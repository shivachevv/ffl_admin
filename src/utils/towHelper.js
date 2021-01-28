export default function (data) {
    let lgMap = {
        "pele": [1, 10],
        "maradona": [13, 22]
    }
    let tow1 = data.filter((x, i) => {
        if (i >= lgMap["pele"][0] && i <= lgMap["pele"][1]) {
            return x
        }
    }).sort((a, b) => {
        return b[4] - a[4]
    })[0]
    let tow2 = data.filter((x, i) => {
        if (i >= lgMap["maradona"][0] && i <= lgMap["maradona"][1]) {
            return x
        }
    }).sort((a, b) => {
        return b[4] - a[4]
    })[0]

    return {
        "pele": {
            team: tow1[1],
            pts: tow1[4]
        },
        "maradona": {
            team: tow2[1],
            pts: tow2[4]
        }
    }
}