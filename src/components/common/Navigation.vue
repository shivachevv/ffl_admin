<template>
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
        <router-link class="menu-item-link" to="/rounds">Rounds</router-link>
      </div>

      <a
        href
        class="menu-item-section"
        @click.prevent="showSectionHandler('players')"
        >Players</a
      >
      <div class="admin-menu-item" v-if="showPlayers">
        <router-link class="menu-item-link" to="/players-edit">
          PlayersEdit
        </router-link>
        <router-link class="menu-item-link" to="/players-points">
          PlayersPoints
        </router-link>
        <router-link class="menu-item-link" to="/sync-points">
          SyncPoints
        </router-link>
      </div>

      <a
        href
        class="menu-item-section"
        @click.prevent="showSectionHandler('users')"
        >Users</a
      >
      <div class="admin-menu-item" v-if="showUsers">
        <router-link class="menu-item-link" to="/users-personal">
          UsersPersonal
        </router-link>
        <router-link class="menu-item-link" to="/users-teams">
          UsersTeams
        </router-link>
      </div>

      <a
        href
        class="menu-item-section"
        @click.prevent="showSectionHandler('transfers')"
        >Transfers</a
      >
      <div class="admin-menu-item" v-if="showTransfers">
        <router-link class="menu-item-link" to="/transfers">
          Transfers
        </router-link>
      </div>

      <a
        href
        class="menu-item-section"
        @click.prevent="showSectionHandler('leagues')"
        >Leagues</a
      >
      <div class="admin-menu-item" v-if="showLeagues">
        <router-link class="menu-item-link" to="/leagues">
          Leagues
        </router-link>
      </div>
      <a
        href
        class="menu-item-section"
        @click.prevent="showSectionHandler('h2h')"
        >H2HLeague</a
      >
      <div class="admin-menu-item" v-if="showH2H">
        <router-link class="menu-item-link" to="/h2h"> H2HLeague </router-link>
      </div>
      <a
        href
        class="menu-item-section"
        @click.prevent="showSectionHandler('cup')"
        >Cup</a
      >
      <div class="admin-menu-item" v-if="showCup">
        <router-link class="menu-item-link" to="/cup-groups-rounds">
          CupGroupsAndRounds
        </router-link>
        <router-link class="menu-item-link" to="/cup-squad-select">
          CupSquadSelect
        </router-link>
        <router-link class="menu-item-link" to="/cup-match-points">
          CupMatchPoints
        </router-link>
      </div>
      <a
        href
        class="menu-item-section"
        @click.prevent="showSectionHandler('matching')"
        >Matching</a
      >
      <div class="admin-menu-item" v-if="showMatching">
        <router-link class="menu-item-link" to="/matching">
          Matching
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navigation",
  props: {},
  data() {
    return {
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
        display: inline-block;
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
</style>
