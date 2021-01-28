import loadResource from "../../utils/resources/loadResource";


const state = {
    matching: undefined,
};

const getters = {
    matching: state => state.matching
};

const actions = {
    async fetchMatching({
        commit
    }) {
        const matching = await loadResource('matching')
        commit('setMatching', matching)
    }
};

const mutations = {
    setMatching: (state, h) => {
        state.matching = h
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};