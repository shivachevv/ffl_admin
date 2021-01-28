const date = new Date();
const prettyDate = date.toLocaleString('en-US', { timeZone: 'Europe/Sofia' });

const makeNewTransfer = (
    round,
    team,
    position,
    transferOut,
    transferIn
) => {
    return {
        round,
        team,
        position,
        transferIn,
        transferOut,
        status: 'pending',
        timeMade: prettyDate
    }
}

export default makeNewTransfer