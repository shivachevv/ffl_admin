<template>
  <div class="add-form-container" v-if="users">
    <vs-alert :active.sync="error" closable close-icon="close">{{errorMsg}}</vs-alert>
    <vs-alert
      v-if="success"
      title="Upload finished!"
      active="true"
      color="success"
    >Round succesfully added!</vs-alert>
    <form @submit.prevent="addRoundHandler">
      <vs-input
        label="Which play-round will be held during??"
        placeholder="Round number"
        v-model="newRound.roundHeld"
        type="number"
      />

      <!-- MATCHES -->

      <div v-for="match in 8" :key="match" class="match-container">
        <!-- TEAM 1 -->
        <vs-select
          :label="`Match ${match}. Team 1`"
          v-model="newRound.matches[`match${match}`].team1"
          icon
          placeholder="Select team"
        >
          <vs-select-item
            :key="u"
            :value="u"
            :text="users[u].userTeam"
            v-for="u in sortedUsers"
          />
        </vs-select>

        <!-- TEAM 2 -->
        <vs-select
          :label="`Match ${match}. Team 2`"
          v-model="newRound.matches[`match${match}`].team2"
          icon
          placeholder="Select team"
        >
          <vs-select-item
            :key="u"
            :value="u"
            :text="users[u].userTeam"
            v-for="u in sortedUsers"
          />
        </vs-select>
      </div>
      <!-- MATCHES END -->

      <!-- <div v-if="newLeague.teams.length" class="league-teams">
        <span>Teams:</span>
        <div
          v-for="user in newLeague.teams"
          :key="user"
          @click.prevent="removePlayerFromLeague(user)"
        >{{users[user].userTeam}}</div>
      </div>-->

      <vs-button color="#59A95D" button="submit" type="relief" size="large">Create Round</vs-button>
    </form>
  </div>
</template>

<script>
import makeNewH2HRound from "../../../models/H2HRound";
import { DATA_URL } from "../../../common";
import getAllH2HRounds from '../../../utils/getAllH2HRounds';
// import getAllLeagues from "../../../utils/getAllLeagues";
// import { addPlayerPts, makeNewPlayer } from "../../../models/Player";
// import { getAllPlayersDataCathegorized } from "../../../utils/getAllPlayersData";
// import getAllUsers from "../../../utils/getAllUsers";
// import { getCurrentRound } from "../../../utils/getCurrentRound";

export default {
  name: "AddH2HRoundForm",
  props: {
    h2hrounds: {
      required: true,
      type: Object
    },
    users: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      newRound: {
        matches: {
          match1: {},
          match2: {},
          match3: {},
          match4: {},
          match5: {},
          match6: {},
          match7: {},
          match8: {}
        },
        roundHeld: "",
        name: ""
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
    async addRoundHandler() {
      this.isNewRoundOK();
      if (this.isNewRoundOK()) {
        const { roundHeld, matches } = this.newRound;
        const name = `R${this.newRoundNumber}`
        const round = makeNewH2HRound(name, matches, roundHeld);
        await this.fetchNewH2HRound(round);
      } else {
        this.error = true;
        this.errorMsg = "Please fill all fields correctly!";
      }
    },
    isNewRoundOK() {
      if (
        // this.newRound.name &&
        this.newRound.roundHeld &&
        this.newRound.matches.match1 &&
        this.newRound.matches.match2 &&
        this.newRound.matches.match3 &&
        this.newRound.matches.match4 &&
        this.newRound.matches.match5 &&
        this.newRound.matches.match6 &&
        this.newRound.matches.match7 &&
        this.newRound.matches.match8
      ) {
        return true;
      } else {
        return false;
      }
    },
    fetchNewH2HRound(payload) {
      this.$vs.loading();
      return fetch(`${DATA_URL}h2h/r${this.newRoundNumber}.json`, {
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
          this.$vs.loading.close()
          this.updatedRounds = await getAllH2HRounds();
          this.$emit("updatedH2HRounds", this.updatedRounds);
        })
        .catch(error => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    // createEditedUsers(leagueId, leagueTeams) {
    //   let copy = JSON.parse(JSON.stringify(this.users));

    //   Object.keys(copy).forEach(id => {
    //     if (leagueTeams.includes(id)) {
    //       let user = copy[id];
    //       if (user["league"]) {
    //         user["league"] = leagueId;
    //       } else {
    //         user["league"] = {};
    //         user["league"] = leagueId;
    //       }
    //     }
    //   });
    //   return copy;
    // },
    // fetchUpdatedUsers(payload) {
    //   return fetch(`${DATA_URL}users.json`, {
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
    //       this.$vs.loading();
    //       this.users = await getAllUsers();
    //     })
    //     .catch(error => {
    //       console.error("Error:", error);
    //       this.error = true;
    //       this.errorMsg = error;
    //     });
    // },
    
    // removePlayerFromLeague(u) {
    //   return (this.newLeague.teams = this.newLeague.teams.filter(x => {
    //     return x !== u;
    //   }));
    // }
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
  computed: {
    newRoundNumber(){
      if (this.h2hrounds) {
        return Number(Object.keys(this.h2hrounds).length + 1)
      } else {
        return 1
      }
    },
    sortedUsers(){
      return Object.keys(this.users).sort((a,b)=>{
        return this.users[a].userTeam.localeCompare(this.users[b].userTeam)
      })
    }
  },
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
    }
  },
  async created() {}
};
</script>

<style lang="scss">
.add-form-container {
  form {
    div {
      margin: 10px 0 0 0;
    }
    .match-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #949494;
      padding: 0 0 10px 0;
      font-weight: bold;
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