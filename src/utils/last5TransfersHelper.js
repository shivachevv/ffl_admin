export default function (data) {

    return data.map(x => {
            return {
                "round": x[0],
                "team": x[1],
                "position": x[2],
                "playerIn": x[3],
                "playerInClub": x[4],
                "playerOut": x[5],
                "playerOutClub": x[6]
            }
        })
        .slice(1)
        .filter((x, i) => {
            if (i > data.length - 7) {
                return x
            }
        })
}