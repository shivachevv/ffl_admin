// import getCup from "../../utils/getCup";
import loadResource from "../../utils/resources/loadResource";


const state = {
    cup: undefined,
};

const getters = {
    cup: state => state.cup
};

const actions = {
    async fetchCup({
        commit
    }) {
        const cup = await loadResource('cup')
        commit('setCup', cup)
    }
};

const mutations = {
    setCup: (state, c) => {
        state.cup = c
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};