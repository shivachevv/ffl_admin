<template>
  <div class="rounds-container" v-if="players">
    <h1 class="section-header">Rounds section</h1>
    <div class="rounds">
      <span>Current Round: {{ currentRound }}</span>
      <div class="round-buttons">
        <!-- <button @click.prevent="deleteRndHandler">Delete Round</button> -->
        <vs-button
          color="#59A95D"
          button="submit"
          type="relief"
          size="normal"
          @click.prevent="addRndHandler"
          >Add Round</vs-button
        >
      </div>
      <vs-button
        color="#59A95D"
        button="submit"
        type="relief"
        size="normal"
        @click.prevent="test"
        >TEST</vs-button
      >
    </div>
    <vs-alert
      v-if="success"
      title="Update finished!"
      active="true"
      color="success"
      >Successfully added new round: {{ currentRound }}</vs-alert
    >
    <vs-alert
      v-if="error"
      title="An Error occured!"
      active="true"
      color="danger"
      >There was an error: {{ errorMsg }}</vs-alert
    >
  </div>
</template>

<script>
import { getCurrentRound, setNewRound } from "../../../utils/getCurrentRound";
import { getAllPlayersDataNormal } from "../../../utils/getAllPlayersData";
import { DATA_URL } from "../../../common";
import { addPlayerPts } from "../../../models/Player";
import { addUserRound } from "../../../models/User";
import getAllUsers from "../../../utils/getAllUsers";
import pointsCalculator from "../../../utils/pointsCalculator";
import { setLastUpdateDB } from "../../../utils/setLastUpdate";
import updateLightPlayers from "../../../utils/updateLightPlayers";
import updateStats from '../../../utils/updateStats'
// import getAllH2HRounds from "../../../utils/getAllH2HRounds";

export default {
  name: "Rounds",
  components: {},
  data() {
    return {
      currentRound: undefined,
      players: undefined,
      users: undefined,
      h2hrounds: undefined,
      success: false,
      error: false,
      errorMsg: "",
    };
  },
  methods: {
    // deleteRndHandler() {},
    addRndHandler() {
      const editedPlayers = this.createUpdatedPlayersObject();
      const editedUsers = this.createUpdatedUsersObject();
      // const editedH2HRounds = this.createUpdatedH2HObject();

      this.$vs.dialog({
        color: "success",
        title: "Confirm New Round!",
        text: `Are you sure you want to add new round ${
          this.currentRound + 1
        }?`,
        accept: async () => {
          await updateStats()
          this.fetchNewRound();
          this.fetchNewRndDataToPlayers(editedPlayers);
          this.fetchNewRndDataToUsers(editedUsers);
        },
      });
    },
    async fetchNewRound() {
      try {
        this.currentRound = await setNewRound(this.currentRound + 1);
      } catch (error) {
        this.error = true;
        this.errorMsg = error;
      }
    },
    fetchNewRndDataToUsers(payload) {
      // const payload = this.createUpdatedUsersObject()
      return fetch(`${DATA_URL}users.json`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then(async () => {
          this.users = await getAllUsers();
          this.success = true;
          this.$vs.loading.close();
        })
        .catch((error) => {
          console.error("Error:", error);
          this.error = true;
          this.$vs.loading.close();
          this.errorMsg = error;
        });
    },
    fetchNewRndDataToPlayers(payload) {
      this.$vs.loading();

      return fetch(`${DATA_URL}players.json`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then(async () => {
          this.players = await getAllPlayersDataNormal();
          setLastUpdateDB();
          updateLightPlayers();
          this.success = true;
          this.$vs.loading.close();
        })
        .catch((error) => {
          console.error("Error:", error);
          this.error = true;
          this.$vs.loading.close();
          this.errorMsg = error;
        });
    },
    createUpdatedUsersObject() {
      let copy = JSON.parse(JSON.stringify(this.users));

      Object.keys(copy).forEach((id) => {
        const team = this.createNextRndTeam(copy[id]);
        const transfers = this.createNextRndTransfers(copy[id]);
        const cpt = this.createNextRndCaptains(copy[id], "cpt");
        const viceCpt = this.createNextRndCaptains(copy[id], "viceCpt");
        const superCpt = this.createNextRndSuperCpt(copy[id]);

        if (copy[id]["rounds"]) {
          copy[id]["rounds"][`r${this.currentRound + 1}`] = addUserRound(
            team,
            transfers,
            cpt,
            viceCpt,
            superCpt
          );
        } else {
          copy[id]["rounds"] = {};
          copy[id]["rounds"][`r${this.currentRound + 1}`] = addUserRound(
            team,
            transfers,
            cpt,
            viceCpt,
            superCpt
          );
        }
      });
      return copy;

      // const testTeam = {
      //   "gk":  "c6752392-58b2-4855-ae56-613e90da8b85",
      //   "dl1": "c68a8f35-04b3-4f9c-95a1-54019718a20a",
      //   "dl2": "c69044ec-eec1-4fbc-a142-6d2d5ff605e7",
      //   "dc1": "c6969c32-f562-4fc5-8550-59e43be4a6af",
      //   "dc2": "c69ba8a6-24c1-4481-81d1-1097c61c498d",
      //   "dr1": "c6c3803a-3f95-42c6-aed3-92ca9df5229b",
      //   "dr2": "c6c3cb72-6687-443e-9ebc-b14a8498e889",
      //   "ml1": "c6c42c26-f723-4837-89c7-e51920920695",
      //   "ml2": "c6d8a167-0434-42dc-aa20-36bd6e6ae772",
      //   "mc1": "c6e6f895-6b06-4db3-8fa4-cc0ac147d50f",
      //   "mc2": "c6e75a96-0847-45e4-81ad-3b16acb4365b",
      //   "mr1": "c6eae752-380a-4bf8-a84f-ac6b3090bb62",
      //   "mr2": "c6ed5493-b615-40ec-9281-3b46eb0ee128",
      //   "st1": "c6fb9cea-7699-4102-95b3-e329017a2c9b",
      //   "st2": "c70172ea-875a-4220-84d0-95ec0bef6a34",
      //   "st3": "c711ea51-accb-478a-919c-36103ab3412a"
      // };

      // if (Object.prototype.hasOwnProperty.call(copy[id], "rounds")) {
      //   console.log(1);
      //   copy[id]["rounds"][`r${this.currentRound}`].transfersAvail = 2;
      //   copy[id]["rounds"][`r${this.currentRound}`].transfersMade = 1;
      // } else {
      //   console.log(2);
      //   copy[id]["rounds"] = {};
      //   copy[id]["rounds"][`r${this.currentRound}`].transfersAvail = 2;
      //   copy[id]["rounds"][`r${this.currentRound}`].transfersMade = 1;
      // }
    },
    createUpdatedPlayersObject() {
      let copy = JSON.parse(JSON.stringify(this.players));

      const playerStatsEmptyValues = Array(20).fill("");
      Object.keys(copy).forEach((id) => {
        const player = copy[id];
        if (player["points"]) {
          player["points"][`r${this.currentRound + 1}`] = addPlayerPts(
            // + 1

            0,
            ...playerStatsEmptyValues
          );
          // console.log(player);
          const stats = player["points"][`r${this.currentRound}`].roundStats; // currentRound
          const currentTotalPts = this.currentPlayerTotalPts(
            player.position,
            stats
          );
          player["points"][`r${this.currentRound}`].roundPts = currentTotalPts; // currentRound
        } else {
          player["points"] = {};
          player["points"][`r${this.currentRound + 1}`] = addPlayerPts(
            // + 1
            0,
            ...playerStatsEmptyValues
          );

          if (this.currentRound !== 0) {
            const stats = player["points"][`r${this.currentRound}`].roundStats;
            const currentTotalPts = this.currentPlayerTotalPts(
              player.position,
              stats
            );
            player["points"][
              `r${this.currentRound}`
            ].roundPts = currentTotalPts;
          }
        }
      });
      // this.fetchNewRndDataToPlayers(copy)
      return copy;
    },
    createUpdatedH2HObject() {
      //  TO BE DECIDED WHETHER TO USE !
      // Object.values(this.players).forEach((player) => {
      //   console.log(player.points.r15);
      // });
    },
    createNextRndTeam(user) {
      if (this.currentRound === 0) {
        return {
          gk: "",
          dl1: "",
          dl2: "",
          dc1: "",
          dc2: "",
          dr1: "",
          dr2: "",
          ml1: "",
          ml2: "",
          mc1: "",
          mc2: "",
          mr1: "",
          mr2: "",
          st1: "",
          st2: "",
          st3: "",
        };
      }
      const current = user["rounds"][`r${this.currentRound}`].team;
      const next = user["rounds"][`r${this.currentRound}`].nextRndInfo.team;
      return next ? next : current;
      // console.log(user);
      // return {}
    },
    createNextRndTransfers(user) {
      if (this.currentRound === 0) {
        return 1;
      }
      if (user["rounds"][`r${this.currentRound}`].wildCard) {
        return 1;
      }
      const avail = user["rounds"][`r${this.currentRound}`].transfersAvail;
      const made = user["rounds"][`r${this.currentRound}`].transfersMade;
      return avail - made === 0 ? 1 : 2;
      // console.log(user);
      // return 1;
    },
    createNextRndCaptains(user, rank) {
      if (this.currentRound === 0) {
        return "";
      }
      const current = user["rounds"][`r${this.currentRound}`][rank];
      const next = user["rounds"][`r${this.currentRound}`].nextRndInfo[rank];
      return next ? next : current;
      // console.log(user, rank);
      // return
    },
    createNextRndSuperCpt(user) {
      if (this.currentRound === 0) {
        return false;
      }
      return user["rounds"][`r${this.currentRound}`].nextRndInfo.superCpt;
      // console.log(user);
      // return false
    },
    currentPlayerTotalPts(position, stats) {
      return pointsCalculator(
        position,
        stats.assists,
        stats.cleanSheet,
        stats.clearanceOffLine,
        stats.errorLeadToGoal,
        stats.goals,
        stats.lastManTackle,
        stats.manOfTheMatch,
        stats.ownGoals,
        stats.penaltyGoals,
        stats.penaltyMissed,
        stats.penaltySaved,
        stats.ratingOver85,
        stats.redCards,
        stats.saves,
        stats.shotsOnPost,
        stats.starter,
        stats.sub,
        stats.teamVictory,
        stats.threeAllowed,
        stats.yellowCards
      );
    },
    test() {
      console.log('stats call');
      updateStats()
      // const teams = Object.values(users)
      //   .filter((x) => {
      //     if (x.code && x.code >= 12) {
      //       return x;
      //     }
      //   })
      //   .map((x) => {
      //     return x.rounds;
      //   })
      //   .map((x) => {
      //     return Object.values(x);
      //   })
      //   .flat()
      //   .map((x) => {
      //     return Object.values(x.team);
      //   })
      //   .flat();
      // const uniqueTeamPlayers = [...new Set(teams)];
      // Object.keys(players).forEach((id) => {
      //   const isActive = uniqueTeamPlayers.includes(id);
      //   if (!isActive && Object.values(players[id].available)[1] === false) {
      //     console.log('MARADONA',",", players[id].name, ",", players[id].club);
      //   }
      // });
      // Object.values(users)
      //   .filter((x) => {
      //     if (x.code) {
      //       return x;
      //     }
      //   })
      //   .sort((a, b) => {
      //     return a.code - b.code;
      //   })
      //   .forEach((x,i) => {
      //     const team = Object.values(x.rounds.r18.team);
      //     team.forEach((y) => {
      //       if (i<11 && Object.values(players[y].available)[0] === true) {
      //         console.log('PELE', x.userTeam, ",", players[y].name, ",", players[y].club);
      //       }
      //       if (i>=11 && Object.values(players[y].available)[1] === true) {
      //         console.log('MARADONA',x.userTeam, ",", players[y].name, ",", players[y].club);
      //       }
      //       // if (i<11) {
      //       //   Object.values(players).forEach(z=>{
      //       //     if (z.id !== y && Object.values(z.available)[0]=== false) {
      //       //       console.log('PELE', x.userTeam, ",", players[y].name, ",", players[y].club);
      //       //     }
      //       //   })
      //       // }
      //       // if (i>=11) {
      //       //   Object.values(players).forEach(z=>{
      //       //     if (z.id !== y && Object.values(z.available)[1]=== false) {
      //       //       console.log('MARADONA', x.userTeam, ",", players[y].name, ",", players[y].club);
      //       //     }
      //       //   })
      //       // }
      //     });
      //   });
      // Object.values(players)
      //   .filter((x) => {
      //     const avail = Object.values(x.available).includes(false);
      //     if (avail) {
      //       return x;
      //     }
      //   })
      //   .forEach((x) => {
      //     console.log(
      //       x.name,',',
      //       x.club,',',
      //       Object.values(x.available)[0],',',
      //       Object.values(x.available)[1]
      //     );
      //   });
    },
  },
  computed: {},
  watch: {
    players(nv) {
      if (nv && this.users) {
        this.$vs.loading.close();
      }
    },
    // currentRound(nv) {
    //   if (nv && this.players && this.users) {
    //     this.$vs.loading.close();
    //   }
    // },
    users(nv) {
      if (nv && this.players) {
        this.$vs.loading.close();
      }
    },
    // h2hrounds(nv) {
    //   if (nv && this.players && this.currentRound && this.users) {
    //     this.$vs.loading.close();
    //   }
    // },
    success(nv) {
      if (nv === true) {
        setTimeout(() => {
          this.success = false;
        }, 3000);
      }
    },
    // error(nv) {
    //   if (nv === true) {
    //     setTimeout(() => {
    //       this.error = false;
    //     }, 3000);
    //   }
    // }
  },
  async created() {
    this.$vs.loading();
    getCurrentRound().then((data) => (this.currentRound = data));
    getAllPlayersDataNormal().then((data) => (this.players = data));
    getAllUsers().then((data) => (this.users = data));
    // getAllH2HRounds().then(data => (this.h2hrounds = data));
  },
};
</script>

<style lang="scss">
$btn-color: #5ac683;

.rounds-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .rounds {
    width: 40%;
    border-radius: 5px;
    margin: 20px 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    font-size: 1.4rem;
    box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.75);

    & > span {
      margin: 0 0 20px 0;
    }
  }

  .con-vs-alert-success {
    background: #46c93a80;
    color: white;
    margin: 15px 0 0 0;
  }
}
</style>