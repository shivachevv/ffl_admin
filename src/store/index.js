import Vue from "vue";
import Vuex from "vuex";
import players from './modules/players'
import leagues from './modules/leagues'
import currentRound from './modules/currentRound'
import users from './modules/users'
import standings from './modules/standings'
import transfers from './modules/transfers'
import cup from './modules/cup'
import h2h from './modules/h2h'
import matching from './modules/matching'
// import loggedUser from './modules/loggedUser'
import stats from './modules/stats'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    players,
    leagues,
    currentRound,
    users,
    standings,
    transfers,
    // loggedUser,
    cup,
    h2h,
    stats,
    matching
  }
});

