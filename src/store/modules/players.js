import loadResource from "../../utils/resources/loadResource";


const state = {
    players: undefined,
    lightPlayers:undefined
};

const getters = {
    players: state => state.players,
    lightPlayers: state => state.lightPlayers,
};

const actions = {
    async fetchPlayers({
        commit
    }) {
        const players = await loadResource('players')
        commit('setPlayers', players)
    },
    async fetchLightPlayers({
        commit
    }) {
        const lightPlayers = await loadResource('lightPlayers')
        commit('setLightPlayers', lightPlayers)
    },
};

const mutations = {
    setPlayers: (state, p) => {
        state.players = p
    },
    setLightPlayers: (state, p) => {
        state.lightPlayers = p
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};