<template>
  <div class="players-points-container">
    <h1 class="section-header">Edit Players Points Section</h1>

    <!-- LEAGUES -->
    <div class="leagues-container" v-if="players">
      <a
        v-for="l in Object.keys(players)"
        :key="l"
        @click.prevent="selectLeagueHandler(l)"
        :class="{ selected: leagueSelected === l }"
        class="points-player-menu-item"
      >
        <img
          :src="
            require(`@/assets/images/user-transfers/leagues/${makeLeagueToImg(
              l
            )}.png`)
          "
          :alt="l"
        />
      </a>
    </div>
    <!-- TEAMS -->
    <div class="teams-container" v-if="players && leagueSelected">
      <a
        v-for="(t, i) in Object.keys(players[leagueSelected])"
        :key="i"
        @click.prevent="selectTeamHandler(t)"
        class="points-player-menu-item"
        :class="{ selected: teamSelected === t }"
        >{{ t }}</a
      >
    </div>

    <!-- PLAYERS -->
    <div
      class="players-container"
      v-if="players && leagueSelected && teamSelected"
    >
      <div class="players-names">
        <vs-alert
          v-if="success"
          title="Update finished!"
          active="true"
          color="success"
          >Player succesfully updated!</vs-alert
        >

        <vs-alert :active.sync="error" closable close-icon="close">{{
          errorMsg
        }}</vs-alert>

        <div class="edit-player-menu-header">
          <span>Players</span>
          <span v-for="i in currentRound" :key="i">{{ i }}</span>
        </div>
        <div
          v-for="p in Object.values(players[leagueSelected][teamSelected])"
          :key="p.id"
          class="edit-player-menu-item"
        >
          <a>{{ p.name }} - {{ p.position }}</a>
          <a
            v-for="(rnd, i) in sortedRounds(Object.entries(p.points))"
            :key="i"
            @click.prevent="selectPlayerRoundHandler(p, rnd[1], i + 1)"
            >{{ rnd[1].roundPts }}</a
          >
        </div>

        <vs-popup
          v-if="playerSelected && roundSelected"
          class="holamundo"
          :title="
            'Edit stats of ' +
              playerSelected.name +
              ' for round ' +
              roundSelected.round +
              '!'
          "
          :active.sync="showPopup"
          @close="closePopup"
        >
          <h2 class="popup-header">Points: {{ selectedPlayerPts }}</h2>
          <form @submit.prevent="submitPlayerRoundStatsHandler">
            <label
              v-for="stat in Object.entries(roundSelected.roundData.roundStats)"
              :key="stat[0]"
            >
              {{ stat[0] }}:
              <vs-input
                :label-placeholder="stat[1]"
                type="number"
                v-model="playerSelectedStats[stat[0]]"
                color="dark"
              />
            </label>
            <vs-button
              color="#59A95D"
              button="submit"
              type="relief"
              size="large"
              >Update Stats</vs-button
            >
          </form>
        </vs-popup>
      </div>
    </div>
  </div>
</template>

<script>
import {
  cathegorizePlayers,
  getAllPlayersDataNormal
} from "../../../utils/getAllPlayersData";
import { getCurrentRound } from "../../../utils/getCurrentRound";
import pointsCalculator from "../../../utils/pointsCalculator";
import { DATA_URL } from "../../../common";
// import getStandings from '../../../utils/getStandings';
import getAllLeagues from "../../../utils/getAllLeagues";
// import standingsHelper from "../../../utils/standingsHelper";
import newStandingsHelper from "../../../utils/newStandingsHelper";
import getAllUsers from "../../../utils/getAllUsers";
import { setLastUpdateDB } from '../../../utils/setLastUpdate';
import updateLightPlayers from '../../../utils/updateLightPlayers';

export default {
  name: "PlayersPoints",
  components: {},
  data() {
    return {
      currentRound: undefined,
      players: undefined,
      standings: undefined,
      leagues: undefined,
      leagueSelected: "",
      teamSelected: "",
      playerSelected: "",
      roundSelected: "",
      showPopup: false,
      playerSelectedStats: {},
      success: false,
      error: false,
      errorMsg: ""
    };
  },
  methods: {
    makeLeagueToImg(v) {
      return v
        .toLowerCase()
        .split(" ")
        .join("-");
    },
    selectLeagueHandler(l) {
      this.teamSelected = "";
      return (this.leagueSelected = l);
    },
    selectTeamHandler(t) {
      this.playerSelected = "";
      return (this.teamSelected = t);
    },
    mergeStats(_new, _old) {
      let result = {};
      Object.keys(_old).forEach(stat => {
        if (_new[stat]) {
          result[stat] = _new[stat];
        } else {
          result[stat] = _old[stat];
        }
      });

      return result;
    },
    selectPlayerRoundHandler(p, rnd, rndCount) {
      this.playerSelected = p;
      this.roundSelected = {
        round: rndCount,
        roundData: rnd
      };
      return (this.showPopup = true);
    },
    submitPlayerRoundStatsHandler() {
      const merged = this.mergeStats(
        this.playerSelectedStats,
        this.roundSelected.roundData.roundStats
      );
      const payload = {
        roundPts: this.selectedPlayerPts,
        roundStats: merged
      };

      return fetch(
        `${DATA_URL}players/${this.playerSelected.id}/points/r${this.roundSelected.round}.json`,
        {
          method: "PATCH",
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      )
        .then(response => response.json())
        .then(async () => {
          this.$vs.loading();
          const tmpPlayers = await getAllPlayersDataNormal();
          this.players = cathegorizePlayers(tmpPlayers);
          setLastUpdateDB()
          updateLightPlayers()

          // const previousStandings = standingsHelper(
          //   undefined,
          //   this.leagues,
          //   tmpPlayers,
          //   this.users,
          //   this.currentRound - 1
          // );

          // const currentStandings = standingsHelper(
          //   previousStandings,
          //   this.leagues,
          //   tmpPlayers,
          //   this.users,
          //   this.currentRound
          // );

          const standings = await newStandingsHelper(
            tmpPlayers,
            this.users,
            this.leagues,
            this.currentRound,
            false
          );
          await this.deleteStandings()
          // this.fetchUpdatedStandingsObject(currentStandings, this.currentRound);
          this.fetchUpdatedStandingsObject1(standings);
          this.success = true;
          // this.$emit('close', false)
        })
        .catch(error => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    fetchUpdatedStandingsObject(payload, round) {
      return fetch(`${DATA_URL}standings/r${round}.json`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(async () => {
          console.log("Success!");
          // this.standings = data
        })
        .catch(err => {
          console.error("Error:", err);
          this.$vs.loading.close();
          this.error = true;
          this.errorMsg = err;
        });
    },
    fetchUpdatedStandingsObject1(payload) {
      return fetch(`${DATA_URL}newstandings.json`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(async () => {
          console.log("Success!");
          // this.standings = data
        })
        .catch(err => {
          console.error("Error:", err);
          this.$vs.loading.close();
          this.error = true;
          this.errorMsg = err;
        });
    },
    async deleteStandings(){
     return await fetch(`${DATA_URL}newstandings.json`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
        })
        .catch(error => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    sortedRounds(arr) {
      const sorted = arr.sort((x, y) => {
        const rnd1 = Number(x[0].substring(1, 3));
        const rnd2 = Number(y[0].substring(1, 3));
        return rnd1 - rnd2;
      });
      return sorted;
    },
    closePopup() {
      console.log("close");
      return (this.showPopup = false);
    }
  },
  computed: {
    selectedPlayerPts() {
      if (this.playerSelected && this.roundSelected) {
        const merged = this.mergeStats(
          this.playerSelectedStats,
          this.roundSelected.roundData.roundStats
        );
        const arr = Object.values(merged);
        return pointsCalculator(this.playerSelected.position, ...arr);
      } else {
        return "";
      }
    }
  },
  watch: {
    players(nv) {
      if (nv && this.currentRound) {
        this.$vs.loading.close();
      }
    },
    currentRound(nv) {
      if (nv && this.players) {
        this.$vs.loading.close();
      }
    },
    showPopup(nv) {
      if (!nv) {
        this.playerSelected = "";
        this.roundSelected = "";
        this.playerSelectedStats = {};
      }
    },
    success(nv) {
      if (nv === true) {
        setTimeout(() => {
          this.success = false;
        }, 2000);
      }
    }
  },
  async created() {
    this.$vs.loading();
    const tmpPlayers = await getAllPlayersDataNormal();
    this.players = cathegorizePlayers(tmpPlayers);
    this.currentRound = await getCurrentRound();
    // this.standings = await getStandings()
    this.leagues = await getAllLeagues();
    this.users = await getAllUsers();
  }
};
</script>

<style lang="scss">
.players-points-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .leagues-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin: 20px 0 0 0;

    a.points-player-menu-item {
      width: 5%;
      height: 50px;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 4px;
      background-color: #a0a0a0;
      border-radius: 7px;

      &:hover {
        cursor: pointer;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
      }
      &:active {
        background-color: #71b171;
      }
      &.selected {
        background-color: #84c884;
      }
      img {
        width: 60%;
      }
    }
  }

  .teams-container {
    width: 100%;
    margin: 20px 0 0 0;
    padding: 0 10px;
    display: grid;
    grid-column-gap: 5px;
    grid-row-gap: 5px;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(2, 1fr);

    a.points-player-menu-item {
      width: 100%;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 4px;
      background-color: #a0a0a0;
      border-radius: 7px;
      text-align: center;

      &:hover {
        cursor: pointer;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
      }
      &:active {
        background-color: #71b171;
      }
      &.selected {
        background-color: #84c884;
      }
      img {
        width: 60%;
      }
    }
  }

  .players-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 20px 0 0 0;

    .players-names {
      width: 97%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin: 0 0 0 20px;
      background-color: #b4b4b4;
      border-radius: 5px;
      overflow: hidden;

      .con-vs-alert-success {
        background: #46c93a80;
        color: white;
        margin: 15px;
        width: 97%;
      }

      .con-vs-alert-primary {
        width: 98%;
        margin: 10px;
        background-color: #e5000059;
        color: white;

        .con-vs-alert-primary .con-x {
          background-color: #3b454b;
          color: #fff;
        }
      }

      .edit-player-menu-header {
        width: 100%;
        padding: 5px 5px 5px 5px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        transition: all 0.3s;
        background-color: #3b454b;
        color: #c6c6c6;
        font-weight: bold;

        span:not(:first-child) {
          display: inline-block;
          width: 3%;
          text-align: center;
        }

        span:first-child {
          width: 20%;
          display: inline-block;
        }
      }

      .edit-player-menu-item {
        width: 100%;
        padding: 5px 5px 5px 5px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        transition: all 0.3s;

        &:hover {
          background-color: darken($color: #b4b4b4, $amount: 10);
        }

        a:not(:first-child) {
          display: inline-block;
          width: 3%;
          cursor: pointer;
          text-align: center;

          &:hover {
            text-decoration: underline;
          }
        }

        a:first-child {
          width: 20%;
          display: inline-block;
          cursor: default;
        }
      }
    }
  }
}

.vs-popup--content {
  .popup-header {
    padding: 10px 0;
    font-weight: bold;
    border-bottom: 1px solid #23292d;
  }

  form {
    padding: 10px 0;

    label {
      text-transform: capitalize;
      margin: 10px;
    }

    button {
      margin: 20px;
    }
  }
}
</style>