// import getStats from "../../utils/getStats";
import loadResource from "../../utils/resources/loadResource";


const state = {
    stats: undefined,
};

const getters = {
    stats: state => state.stats
};

const actions = {
    async fetchStats({
        commit
    }) {
        const stats = await loadResource('stats')
        commit('setStats', stats)
    }
};

const mutations = {
    setStats: (state, s) => {
        state.stats = s
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};