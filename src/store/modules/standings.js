// import getNewStandings from "../../utils/getNewStandings";
import loadResource from "../../utils/resources/loadResource";


const state = {
    standings: undefined,
};

const getters = {
    standings: state => state.standings,
};

const actions = {
    async fetchStandings({
        commit
    }) {
        const standings = await loadResource('newstandings')

        commit('setStandings', standings)
    }
};

const mutations = {
    setStandings: (state, s) => {
        state.standings = s
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};