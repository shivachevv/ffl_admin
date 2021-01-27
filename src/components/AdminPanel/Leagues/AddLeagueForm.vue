<template>
  <div class="add-form-container" v-if="users">
    <vs-alert :active.sync="error" closable close-icon="close">{{
      errorMsg
    }}</vs-alert>
    <vs-alert
      v-if="success"
      title="Upload finished!"
      active="true"
      color="success"
      >League succesfully added!</vs-alert
    >
    <form @submit.prevent="addLeagueHandler">
      <label class="select"
        >Users
        <select v-model="selectedUser" placeholder="Select an user">
          <option :key="u" :value="u" v-for="u in Object.keys(users)">{{
            users[u].userTeam
          }}</option>
        </select>
      </label>
      <!-- <vs-select
        label="Users"
        v-model="selectedUser"
        icon
        placeholder="Select an user"
      >
        <vs-select-item
          :key="u"
          :value="u"
          :text="users[u].userTeam"
          v-for="u in Object.keys(users)"
        />
      </vs-select> -->
      <vs-input
        label="League Name"
        placeholder="Name the new League"
        v-model="newLeague.name"
      />
      <div v-if="newLeague.teams.length" class="league-teams">
        <span>Teams:</span>
        <div
          v-for="user in newLeague.teams"
          :key="user"
          @click.prevent="removePlayerFromLeague(user)"
        >
          {{ users[user].userTeam }}
        </div>
      </div>

      <vs-button color="#59A95D" button="submit" type="relief" size="large"
        >Create League</vs-button
      >
    </form>
  </div>
</template>

<script>
import makeNewLeague from "../../../models/League";

import { DATA_URL } from "../../../common";
import getAllLeagues from "../../../utils/getAllLeagues";
// import { addPlayerPts, makeNewPlayer } from "../../../models/Player";
// import { getAllPlayersDataCathegorized } from "../../../utils/getAllPlayersData";
import { v4 as uuidv4 } from "uuid";
import getAllUsers from "../../../utils/getAllUsers";
// import { getCurrentRound } from "../../../utils/getCurrentRound";

export default {
  name: "AddLeagueForm",
  props: {
    // players: {
    //   required: true,
    //   type: Object
    // }
  },
  data() {
    return {
      users: undefined,
      newLeague: {
        teams: []
      },
      selectedUser: undefined,
      updatedLeagues: undefined,
      //   newPlayer: {},
      //   showClub: false,
      //   positions: ["GK", "DL", "DC", "DR", "ML", "MC", "MR", "ST"],
      error: false,
      errorMsg: "",
      success: false
    };
  },
  methods: {
    async addLeagueHandler() {
      if (this.isNewLeagueOK()) {
        const { name, teams } = this.newLeague;
        const id = uuidv4();
        const league = makeNewLeague(id, name, teams);
        const users = this.createEditedUsers(id, teams);
        await this.fetchNewLeague(league);
        await this.fetchUpdatedUsers(users);
      } else {
        this.error = true;
        this.errorMsg = "Please enter league name and members!";
      }
    },
    isNewLeagueOK() {
      if (this.newLeague.name && this.newLeague.teams.length) {
        return true;
      }
      return false;
    },
    createEditedUsers(leagueId, leagueTeams) {
      let copy = JSON.parse(JSON.stringify(this.users));

      Object.keys(copy).forEach(id => {
        if (leagueTeams.includes(id)) {
          let user = copy[id];
          if (user["league"]) {
            user["league"] = leagueId;
          } else {
            user["league"] = {};
            user["league"] = leagueId;
          }
        }
      });
      return copy;
    },
    fetchUpdatedUsers(payload) {
      return fetch(`${DATA_URL}users.json`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(async data => {
          console.log("Success:", data);
          this.success = true;
          this.$vs.loading();
          this.users = await getAllUsers();
        })
        .catch(error => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    fetchNewLeague(payload) {
      return fetch(`${DATA_URL}leagues/${payload.id}.json`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(async data => {
          console.log("Success:", data);
          this.success = true;
          this.$vs.loading();
          this.updatedLeagues = await getAllLeagues();
          this.$emit("updatedLeagues", this.updatedLeagues);
        })
        .catch(error => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    removePlayerFromLeague(u) {
      return (this.newLeague.teams = this.newLeague.teams.filter(x => {
        return x !== u;
      }));
    }
    // createPlayerPointsObj(rnd) {
    //   const playerStatsEmptyValues = Array(20).fill("");
    //   let result = {};
    //   for (let i = 0; i < rnd; i++) {
    //     result[`r${i + 1}`] = addPlayerPts(0, ...playerStatsEmptyValues);
    //   }
    //   return result
    // },
    // isNewPlayerOK() {
    //   const { country, club, name, position } = this.newPlayer;
    //   if (country && club && name && position) {
    //     if (this.players[country] && this.players[country][club]) {
    //       return true;
    //     } else {
    //       this.errorMsg = "Club and country do not match!";
    //       this.error = true;
    //       return false;
    //     }
    //   } else {
    //     this.errorMsg = "Please fill all fields!";
    //     this.error = true;
    //     return false;
    //   }
    // },
    // uploadNewPlayer(payload) {
    //   return fetch(`${DATA_URL}players/${payload.id}.json`, {
    //     method: "PATCH",
    //     mode: "cors",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(payload)
    //   })
    //     .then(response => response.json())
    //     .then(async data => {
    //       console.log("Success:", data);
    //       this.success = true;
    //       const updatedPlayers = await getAllPlayersDataCathegorized();
    //       this.$emit("updatedPlayers", updatedPlayers);
    //     })
    //     .catch(err => {
    //       console.error("Error:", err);
    //       this.error = true;
    //       this.errorMsg = err;
    //     });
    // }
  },
  computed: {},
  watch: {
    selectedUser(nv) {
      if (nv && !this.newLeague.teams.includes(nv)) {
        this.newLeague.teams.push(nv);
      }
    },
    // "newPlayer.club": function(nv) {
    //   if (nv) {
    //     this.newPlayer["shirt"] = teamCodes[nv];
    //   }
    // },
    success(nv) {
      if (nv === true) {
        setTimeout(() => {
          this.success = false;
        }, 2000);
      }
    },
    users(nv) {
      if (nv) {
        this.$vs.loading.close();
      }
    }
  },
  async created() {
    this.$vs.loading();
    this.users = await getAllUsers();
  }
};
</script>

<style lang="scss">
.add-form-container {
  form {
    div {
      margin: 10px 0 0 0;
    }
    .select {
      width: 100%;
      display: flex;
      flex-direction: column;
      font-size: 0.8rem;
      text-transform: uppercase;
      margin: 20px 0 0 0;
      select {
        padding: 5px;
        border-radius: 5px;
        font-size: 1rem;
        option {
          padding: 2px;
        }
      }
    }
    .league-teams {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      span {
        font-size: 1.1rem;
        margin: 5px;
      }
      div {
        margin: 5px;
        border-left: 1px solid grey;
        padding: 5px 5px 5px 11px;
        transition: all 0.3s;
        position: relative;
        width: 20%;

        &::after {
          position: absolute;
          content: "x";
          top: 3px;
          right: 7px;
          width: 5px;
          height: 5px;
        }

        &:hover {
          cursor: pointer;
          background-color: #ffbcbc;
        }
      }
    }
  }
  .con-vs-alert-primary {
    width: 98%;
    margin: 10px;
    background-color: #e5000059;
    color: white;
    font-weight: bold;

    .con-x {
      background-color: #a30000;
      color: #fff;
    }
  }
}
</style>