import getAllPlayersRaw from './getAllPlayersRaw'
import { makeNewPlayer } from '../models/Player'
import { DATA_URL } from '../common'
import { v4 as uuidv4 } from 'uuid';

const uploadAllPlayers = async () => {
    const players = await getAllPlayersRaw()
    let payload = {}
    players.forEach(player => {
        const name = player[2]
        const position = player[4]
        const club = player[1]
        const shirt = player[6]
        const id = uuidv4()
        const country = player[5]

        const readyPlayer = makeNewPlayer(name, position, club, shirt, id, country)

        payload[id] = readyPlayer


    });

    fetch(`${DATA_URL}players/.json`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    }).catch(e => console.log(e))

    console.log('PLAYERS UPLOAD READY');

}

export default uploadAllPlayers