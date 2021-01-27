<template>
  <div class="add-form-container">
    <vs-alert :active.sync="error" closable close-icon="close">{{
      errorMsg
    }}</vs-alert>
    <vs-alert
      v-if="success"
      title="Upload finished!"
      active="true"
      color="success"
      >Round succesfully added!</vs-alert
    >

    <form @submit.prevent="addRoundHandler">
      <span>Group: {{ group.name }}</span>

      <vs-input
        label="Which play-round will be held during??"
        placeholder="Round number"
        v-model="newRound.roundHeld"
        type="number"
      />

      <!-- MATCHES -->
      <div
        v-for="match in groupMatchCount"
        :key="match"
        class="match-container"
      >
        <!-- TEAM 1 -->
        <vs-select
          :label="`Match ${match}. Team 1`"
          icon
          placeholder="Select team"
          v-model="newRound[`match${match}`].team1.id"
        >
          <vs-select-item
            :key="u"
            :value="u"
            :text="users[u].userTeam"
            v-for="u in group.teams"
          />
        </vs-select>

        <!-- TEAM 2 -->
        <vs-select
          :label="`Match ${match}. Team 2`"
          icon
          placeholder="Select team"
          v-model="newRound[`match${match}`].team2.id"
        >
          <vs-select-item
            :key="u"
            :value="u"
            :text="users[u].userTeam"
            v-for="u in group.teams"
          />
        </vs-select>
      </div>
      <!-- MATCHES END -->

      <vs-button color="#59A95D" button="submit" type="relief" size="large"
        >Create Round</vs-button
      >
    </form>
  </div>
</template>

<script>
// import makeNewH2HRound from "../../../models/H2HRound";
import { DATA_URL } from "../../../common";
import getAllCupGroups from "../../../utils/getAllCupGroups";
// import getAllLeagues from "../../../utils/getAllLeagues";
// import { addPlayerPts, makeNewPlayer } from "../../../models/Player";
// import { getAllPlayersDataCathegorized } from "../../../utils/getAllPlayersData";
// import getAllUsers from "../../../utils/getAllUsers";
// import { getCurrentRound } from "../../../utils/getCurrentRound";

export default {
  name: "AddCupRoundForm",
  props: {
    group: {
      required: true,
      type: Object,
    },
    users: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      newRound: undefined,
      selectedUser: undefined,
      updatedGroups: undefined,
      groupMatchCount: undefined,
      // matchesCount: undefined,
      //   newPlayer: {},
      //   showClub: false,
      //   positions: ["GK", "DL", "DC", "DR", "ML", "MC", "MR", "ST"],
      error: false,
      errorMsg: "",
      success: false,
    };
  },
  methods: {
    async addRoundHandler() {
      if (this.isNewRoundOK()) {
        await this.fetchNewCupRound(this.newRound);
      } else {
        this.error = true;
        this.errorMsg = "Please fill all fields correctly!";
      }
    },
    isNewRoundOK() {
      const { newRound } = this;
      let flag = true;
      Object.keys(newRound).forEach((matchId) => {
        if (matchId !== "roundHeld") {
          const match = newRound[matchId];
          if (match.team1.id === "" || match.team2.id === "") {
            flag = false;
          }
        }
      });
      return flag;
    },
    fetchNewCupRound(payload) {
      const { name, rounds } = this.group;
      const roundNum = rounds ? Object.keys(rounds).length + 1 : 1;
      this.$vs.loading();
      return fetch(`${DATA_URL}cup/${name}/rounds/r${roundNum}.json`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then(async (data) => {
          console.log("Success:", data);
          this.success = true;
          this.$vs.loading.close();
          this.updatedGroups = await getAllCupGroups();
          this.$emit("updatedCupGroups", this.updatedGroups);
        })
        .catch((error) => {
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
    // removeUserFromGroup(u) {
    //   return (this.newGroup.teams = this.newGroup.teams.filter(x => {
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
    calculateMatchCount() {
      this.groupMatchCount = Math.floor(this.group.teams.length / 2);
      const value = this.groupMatchCount;
      console.log(value);
      if (value === 1) {
        this.newRound = {
          match1: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          roundHeld: "",
        };
      } else if (value === 2) {
        this.newRound = {
          match1: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          match2: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          roundHeld: "",
        };
      } else if (value === 3) {
        this.newRound = {
          match1: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          match2: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          match3: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          roundHeld: "",
        };
      } else if (value === 8) {
        this.newRound = {
          match1: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          match2: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          match3: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          match4: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          match5: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          match6: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          match7: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          match8: {
            team1: {
              id: "",
            },
            team2: {
              id: "",
            },
          },
          roundHeld: "",
        };
      }
    },
  },
  computed: {
    // groupMatchCount() {
    //   return Math.floor(this.group.teams.length / 2);
    // }
  },
  watch: {
    // selectedUser(nv) {
    //   if (nv && !this.newGroup.teams.includes(nv)) {
    //     this.newGroup.teams.push(nv);
    //   }
    // },
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
  },
  created() {
    this.calculateMatchCount();
    console.log("here");
  },
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
    .cup-teams {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      span {
        font-size: 1.1rem;
        font-weight: bold;
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