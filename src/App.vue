<template>
  <div class="app-container">
    <Header />
    <div class="main-container">
      <Navigation />
      <ViewComponent />
    </div>
  </div>
</template>

<script>
import Header from "./components/common/Header";
import Navigation from "./components/common/Navigation.vue";
import ViewComponent from "./components/common/ViewComponent.vue";
import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Header,
    Navigation,
    ViewComponent,
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions([
      "fetchCup",
      "fetchCurrentRound",
      "fetchH2h",
      "fetchLeagues",
      "fetchMatching",
      "fetchPlayers",
      "fetchCathegorizedPlayers",
      "fetchStandings",
      "fetchTransfers",
      "fetchUsers",
    ]),
  },
  computed: {},
  watch: {},
  async created() {
    this.$vs.loading();
    await this.fetchPlayers();
    this.fetchCup();
    this.fetchCurrentRound();
    this.fetchH2h();
    this.fetchLeagues();
    this.fetchMatching();
    this.fetchStandings();
    this.fetchTransfers();
    this.fetchUsers();

    this.$vs.loading.close();
  },
};
</script>

<style lang="scss">
@import "./common/reset.scss";

/*************** CONTAINER **********/

html {
  font-size: 16px;

  // @media #{$mobile} {
  //   font-size: 13px;
  // }
  body {
    background-color: #c6c6c6;

    .app-container {
      width: 100%;
      margin-left: 0;
      margin-right: 0;
      margin-top: 0;
      margin-bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      .main-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
      }
    }
    .up {
      text-transform: uppercase;
    }

    .sha {
      -webkit-box-shadow: 5px 5px 21px -5px rgba(0, 0, 0, 0.43);
      -moz-box-shadow: 5px 5px 21px -5px rgba(0, 0, 0, 0.43);
      box-shadow: 5px 5px 21px -5px rgba(0, 0, 0, 0.43);
    }
  }
}
</style>
