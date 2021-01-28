function removeBlanks(x) {
    return x.filter(x => {
        return x !== ''
    })
}

function sumPts(x) {
    return x.reduce((a, b) => {
        return Number(a) + Number(b)
    }, 0)
}

function perRound(p) {
    return (sumPts(p) / removeBlanks(p).length).toFixed(2)
}

function last5(p) {
    return sumPts(
        removeBlanks(p).slice(removeBlanks(p).length - 5)
    )
}
function last5PerRnd(p){
    return sumPts(removeBlanks(p).slice(removeBlanks(p).length - 5)) / removeBlanks(p).slice(removeBlanks(p).length - 5).length
}

export default {
    perRound,
    last5,
    last5PerRnd
}