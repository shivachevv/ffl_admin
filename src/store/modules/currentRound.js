// import { getCurrentRound } from "../../utils/getCurrentRound";
import loadResource from "../../utils/resources/loadResource";


const state = {
    currentRound: undefined,
};

const getters = {
    currentRound: state => state.currentRound
};

const actions = {
    async fetchCurrentRound({
        commit
    }) {
        const round = await loadResource('round')
        commit('setCurrentRound', round.currentRound)
    }
};

const mutations = {
    setCurrentRound: (state, r) => {
        state.currentRound = r
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};