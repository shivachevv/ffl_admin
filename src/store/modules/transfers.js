// import getAllTransfers from "../../utils/getAllTransfers";
import loadResource from "../../utils/resources/loadResource";


const state = {
    transfers: undefined,
};

const getters = {
    transfers: state => state.transfers
};

const actions = {
    async fetchTransfers({
        commit
    }) {
        const transfers = await loadResource('transfers')
        commit('setTransfers', transfers)
    }
};

const mutations = {
    setTransfers: (state, t) => {
        state.transfers = t
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};