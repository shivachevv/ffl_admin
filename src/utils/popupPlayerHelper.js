export default function (data, p) {

    return data.filter(x => {
        if (p.player) {
            return x[7] === p.player
        } else {
            return x[7] === p.name
        }
    })[0]
}