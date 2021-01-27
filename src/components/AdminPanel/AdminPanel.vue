<template>
  <div class="admin-container">
    <div class="admin-menu">
      <h1 class="admin-menu-header">ADMIN MENU</h1>
      <div class="admin-menu-items">
        <a
          href
          class="menu-item-section"
          @click.prevent="showSectionHandler('rounds')"
          >Rounds</a
        >
        <div class="admin-menu-item" v-if="showRounds">
          <button
            class="menu-item-link"
            @click.prevent="switchComponent"
            :class="{ selected: chosenComponent === 'Rounds' }"
          >
            Rounds
          </button>
        </div>

        <a
          href
          class="menu-item-section"
          @click.prevent="showSectionHandler('players')"
          >Players</a
        >
        <div class="admin-menu-item" v-if="showPlayers">
          <button
            class="menu-item-link"
            @click.prevent="switchComponent"
            :class="{ selected: chosenComponent === 'PlayersEdit' }"
          >
            PlayersEdit
          </button>
          <button
            class="menu-item-link"
            @click.prevent="switchComponent"
            :class="{ selected: chosenComponent === 'PlayersPoints' }"
          >
            PlayersPoints
          </button>
          <button
            class="menu-item-link"
            @click.prevent="switchComponent"
            :class="{ selected: chosenComponent === 'SyncPoints' }"
          >
            SyncPoints
          </button>
        </div>

        <a
          href
          class="menu-item-section"
          @click.prevent="showSectionHandler('users')"
          >Users</a
        >
        <div class="admin-menu-item" v-if="showUsers">
          <button
            @click.prevent="switchComponent"
            class="menu-item-link"
            :class="{ selected: chosenComponent === 'UsersPersonal' }"
          >
            UsersPersonal
          </button>
          <button
            @click.prevent="switchComponent"
            class="menu-item-link"
            :class="{ selected: chosenComponent === 'UsersTeams' }"
          >
            UsersTeams
          </button>
        </div>

        <a
          href
          class="menu-item-section"
          @click.prevent="showSectionHandler('transfers')"
          >Transfers</a
        >
        <div class="admin-menu-item" v-if="showTransfers">
          <button
            class="menu-item-link"
            @click.prevent="switchComponent"
            :class="{ selected: chosenComponent === 'Transfers' }"
          >
            Transfers
          </button>
        </div>

        <a
          href
          class="menu-item-section"
          @click.prevent="showSectionHandler('leagues')"
          >Leagues</a
        >
        <div class="admin-menu-item" v-if="showLeagues">
          <button
            class="menu-item-link"
            @click.prevent="switchComponent"
            :class="{ selected: chosenComponent === 'Leagues' }"
          >
            Leagues
          </button>
        </div>
        <a
          href
          class="menu-item-section"
          @click.prevent="showSectionHandler('h2h')"
          >H2HLeague</a
        >
        <div class="admin-menu-item" v-if="showH2H">
          <button
            class="menu-item-link"
            @click.prevent="switchComponent"
            :class="{ selected: chosenComponent === 'H2HLeague' }"
          >
            H2HLeague
          </button>
        </div>
        <a
          href
          class="menu-item-section"
          @click.prevent="showSectionHandler('cup')"
          >Cup</a
        >
        <div class="admin-menu-item" v-if="showCup">
          <button
            class="menu-item-link"
            @click.prevent="switchComponent"
            :class="{ selected: chosenComponent === 'CupGroupsAndRounds' }"
          >
            CupGroupsAndRounds
          </button>
          <button
            class="menu-item-link"
            @click.prevent="switchComponent"
            :class="{ selected: chosenComponent === 'CupSquadSelect' }"
          >
            CupSquadSelect
          </button>
          <button
            class="menu-item-link"
            @click.prevent="switchComponent"
            :class="{ selected: chosenComponent === 'CupMatchPoints' }"
          >
            CupMatchPoints
          </button>
        </div>
        <a
          href
          class="menu-item-section"
          @click.prevent="showSectionHandler('matching')"
          >Matching</a
        >
        <div class="admin-menu-item" v-if="showMatching">
          <button
            class="menu-item-link"
            @click.prevent="switchComponent"
            :class="{ selected: chosenComponent === 'Matching' }"
          >
            Matching
          </button>
        </div>
      </div>
    </div>
    <div class="admin-details">
      <!-- <keep-alive> -->
      <component v-bind:is="chosenComponent" />
      <!-- </keep-alive> -->
    </div>
  </div>
</template>

<script>
const PlayersEdit = () => import("./Players/PlayersEdit");
const PlayersPoints = () => import("./Players/PlayersPoints");
const SyncPoints = () => import("./Players/SyncPoints");
const Rounds = () => import("./Rounds/Rounds");
const UsersPersonal = () => import("./Users/UsersPersonal");
const UsersTeams = () => import("./Users/UsersTeams");
const Transfers = () => import("./Transfers/Transfers");
const Leagues = () => import("./Leagues/Leagues");
const H2HLeague = () => import("./H2HLeague/H2HLeague");
const CupGroupsAndRounds = () => import("./Cup/CupGroupsAndRounds");
const CupSquadSelect = () => import("./Cup/CupSquadSelect");
const CupMatchPoints = () => import("./Cup/CupMatchPoints");
const Matching = () => import("./Matching/Matching");
const AdminHomeSection = () => import("./AdminHomeSection/AdminHomeSection");

export default {
  name: "AdminPanel",
  components: {
    Rounds,
    PlayersEdit,
    PlayersPoints,
    SyncPoints,
    UsersPersonal,
    UsersTeams,
    Transfers,
    Leagues,
    H2HLeague,
    CupGroupsAndRounds,
    CupSquadSelect,
    CupMatchPoints,
    Matching,
    AdminHomeSection
  },
  data() {
    return {
      chosenComponent: "AdminHomeSection",
      showRounds: false,
      showPlayers: false,
      showUsers: false,
      showTransfers: false,
      showLeagues: false,
      showH2H: false,
      showCup: false,
      showMatching: false,
    };
  },
  methods: {
    switchComponent(e) {
      return (this.chosenComponent = e.target.innerText);
    },
    showSectionHandler(s) {
      if (s === "rounds") {
        this.showRounds = !this.showRounds;
      } else if (s === "players") {
        this.showPlayers = !this.showPlayers;
      } else if (s === "users") {
        this.showUsers = !this.showUsers;
      } else if (s === "transfers") {
        this.showTransfers = !this.showTransfers;
      } else if (s === "leagues") {
        this.showLeagues = !this.showLeagues;
      } else if (s === "h2h") {
        this.showH2H = !this.showH2H;
      } else if (s === "cup") {
        this.showCup = !this.showCup;
      } else if (s === "matching") {
        this.showMatching = !this.showMatching;
      }
    },
  },
  computed: {},
  watch: {},
  created() {},
  // beforeDestroy() {
  //   console.log('destroy', this);
  // },
};
</script>

<style lang="scss">
.admin-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  .admin-menu {
    width: 15%;
    background-color: #3c474d;
    h1 {
      text-align: center;
      width: 100%;
      color: #fbffff;
      padding: 10px 0;
      border-bottom: 3px solid #893f40;
    }

    .admin-menu-items {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      .menu-item-section {
        padding: 10px 0;
        color: #fbffff;
        width: 100%;
        text-align: center;
        transition: all 0.3s;
        background-color: #3b454b;
        border: none;
        font-size: 1rem;
        cursor: pointer;

        &:hover {
          background-color: darkorange;
        }
      }

      .admin-menu-item {
        width: 100%;

        .selected {
          font-weight: bold;
          text-decoration: underline;
        }

        .menu-item-link {
          padding: 10px 0;
          color: #3b454b;
          width: 100%;
          text-align: center;
          transition: all 0.3s;
          background-color: #b7b7b7;
          border: none;
          font-size: 1rem;
          cursor: pointer;

          &:hover {
            background-color: darkorange;
          }
        }
      }
    }
  }

  .admin-details {
    width: 85%;

    .section-header {
      margin: 20px 0 0 0;
      font-size: 1.3rem;
      text-decoration: underline;
      width: 100%;
      text-align: center;
    }
  }
}
</style>