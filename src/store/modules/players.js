import loadResource from "../../utils/resources/loadResource";
import { cathegorizePlayers } from '../../utils/getAllPlayersData'

const state = {
    players: undefined,
    lightPlayers: undefined,
    cathegorizedPlayers: undefined
};

const getters = {
    players: state => state.players,
    lightPlayers: state => state.lightPlayers,
    cathegorizedPlayers: state => state.cathegorizedPlayers,
};

const actions = {
    async fetchPlayers({
        commit
    }) {
        const players = await loadResource('players')
        const cathegorizedPlayers = cathegorizePlayers(players)
        commit('setPlayers', players)
        commit('setCathegorizedPlayers', cathegorizedPlayers)
    },
    async fetchLightPlayers({
        commit
    }) {
        const lightPlayers = await loadResource('lightPlayers')
        commit('setLightPlayers', lightPlayers)
    },
    // async fetchCathegorizedPlayers({
    //     commit
    // }) {
    //     const players = await loadResource('players')
    //     const cathegorizedPlayers = cathegorizePlayers(players)
    //     commit('setCathegorizedPlayers', cathegorizedPlayers)
    // }
};

const mutations = {
    setPlayers: (state, p) => {
        state.players = p
    },
    setLightPlayers: (state, p) => {
        state.lightPlayers = p
    },
    setCathegorizedPlayers: (state, p) => {
        state.cathegorizedPlayers = p
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};