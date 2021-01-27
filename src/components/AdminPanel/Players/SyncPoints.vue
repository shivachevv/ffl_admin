<template>
  <div class="sync-points-container" v-if="players && currentRound">
    <h1 class="section-header">
      Sync Player Points Section. Current round is: {{ currentRound }}
    </h1>

    <vs-alert :active.sync="error" closable close-icon="close" color="danger">{{
      errorMsg
    }}</vs-alert>

    <h3 v-if="lastUpdate">Points last uploaded: {{ lastUpdate }}</h3>
    <div class="sync-section">
      <p>Select round:</p>
      <div class="rounds">
        <a
          href
          v-for="rnd of Object.keys(roundDates)"
          :key="rnd"
          @click.prevent="selectRoundDates(rnd)"
          :class="{
            selected:
              form.from === roundDates[rnd].from &&
              form.to === roundDates[rnd].to,
            unavailable: rnd > currentRound,
          }"
          >{{ rnd }}</a
        >
      </div>
      <div class="form-container">
        <img
          :src="
            require(`@/assets/images/adminpanel/${
              buttonEnablerFlags.upload ? 'check' : 'uncheck'
            }.png`)
          "
          alt="flag"
        />
        <form @submit.prevent="uploadDialog" class="download">
          <label>
            <span>League</span>
            <select name="league" v-model="form.league">
              <option value>All leagues</option>
              <option value="2">England-Premier-League</option>
              <option value="22">France-Ligue-1</option>
              <option value="3">Germany-Bundesliga</option>
              <option value="5">Italy-Serie-A</option>
              <option value="13">Netherlands-Eredivisie</option>
              <option value="21">Portugal-Liga-NOS</option>
              <option value="4">Spain-LaLiga</option>
              <option value="17">Turkey-Super-Lig</option>
            </select>
          </label>
          <label>
            <span>Date from:</span>
            <input name="from" type="date" v-model="form.from" required />
          </label>
          <label>
            <span>Date till:</span>
            <input name="till" type="date" v-model="form.to" required />
          </label>
          <label>
            <span>Format:</span>
            <select name="format" v-model="form.format">
              <option value="json">json</option>
              <option value="csv">csv</option>
            </select>
          </label>
          <label>
            <span>Target:</span>
            <input type="text" name="target" v-model="form.target" />
          </label>
          <vs-button color="#59A95D" button="submit" type="relief" size="normal"
            >1. UPLOAD POINTS</vs-button
          >
        </form>
      </div>
    </div>

    <div class="sync-section">
      <img
        :src="
          require(`@/assets/images/adminpanel/${
            buttonEnablerFlags.download ? 'check' : 'uncheck'
          }.png`)
        "
        alt="flag"
      />
      <vs-button
        color="#59A95D"
        type="relief"
        size="normal"
        @click="downloadDialog"
        >2. DOWNLOAD POINTS</vs-button
      >
    </div>

    <h3 v-if="lastSync">Points last synced: {{ lastSync }}</h3>
    <div class="sync-section">
      <p>Select which round to sync points for:</p>
      <div class="rounds">
        <a
          href
          v-for="rnd of Object.keys(roundDates)"
          :key="rnd"
          @click.prevent="selectSyncRoundHandler(rnd)"
          :class="{
            selected: rnd === selectedSyncRound,
            unavailable: rnd > currentRound,
          }"
          >{{ rnd }}</a
        >
      </div>
      <div class="sync-container">
        <img
          :src="
            require(`@/assets/images/adminpanel/${
              buttonEnablerFlags.sync ? 'check' : 'uncheck'
            }.png`)
          "
          alt="flag"
        />
        <vs-button
          color="#59A95D"
          type="relief"
          size="normal"
          @click="syncDialog"
          >3. SYNC POINTS WITH PLAYERS</vs-button
        >
        <vs-button
          color="#59A95D"
          type="relief"
          size="normal"
          @click="deleteStandings"
          >TEST</vs-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getPointsFromTool } from "../../../utils/getPointsFromTool";
import { getAllPlayersDataNormal } from "../../../utils/getAllPlayersData";
import syncPointsHelper from "../../../utils/syncPointsHelper";
import { getCurrentRound } from "../../../utils/getCurrentRound";
import { DATA_URL, roundDates } from "../../../common";
import getAllLeagues from "../../../utils/getAllLeagues";
import getAllUsers from "../../../utils/getAllUsers";
import getStandings from "../../../utils/getStandings";
// import standingsHelper from "../../../utils/standingsHelper";
import newStandingsHelper from "../../../utils/newStandingsHelper";
import { setLastUpdateDB } from "../../../utils/setLastUpdate";
import updateLightPlayers from '../../../utils/updateLightPlayers';

export default {
  name: "SyncPoints",
  components: {},
  data() {
    return {
      roundDates: roundDates,
      points: undefined,
      lastUpdate: "",
      lastSync: "",
      form: {
        league: "",
        from: "",
        to: "",
        format: "json",
        target: "https://ffl-3-new.firebaseio.com/pointsSync/points.json",
      },
      toolUrl: "https://whoscored.tailored.tools/results",
      proxyUrl: "https://cors-anywhere.herokuapp.com/",
      lastUpdateUrl: `${DATA_URL}pointsSync/lastUpdate.json`,
      lastSyncUrl: `${DATA_URL}pointsSync/lastSync.json`,
      isLeagueSelected: false,
      buttonEnablerFlags: {
        upload: false,
        download: false,
        sync: false,
      },
      leaguesNames: {
        2: "England-Premier-League",
        22: "France-Ligue-1",
        3: "Germany-Bundesliga",
        5: "Italy-Serie-A",
        13: "Netherlands-Eredivisie",
        21: "Portugal-Liga-NOS",
        4: "Spain-LaLiga",
        17: "Turkey-Super-Lig",
      },
      currentRound: undefined,
      selectedSyncRound: undefined,
      players: undefined,
      leagues: undefined,
      users: undefined,
      standings: undefined,
      error: false,
      errorMsg: "",
    };
  },
  methods: {
    test() {
      // const result = newStandingsHelper(this.players, this.users, this.leagues, this.currentRound)
      // const result1 = newStandingsHelper(this.players, this.users, this.leagues, this.currentRound - 1)
      // result
      // result1
      // console.log(result);
    },
    uploadDialog() {
      const { league, from, to } = this.form;
      this.$vs.dialog({
        color: "success",
        title: "Upload points from tool!",
        text: `Are you sure you want to upload data for ${
          league ? this.leaguesNames[league] : "All leagues"
        } from ${from} to ${to}?`,
        accept: () => this.uploadHandler(),
      });
    },
    downloadDialog() {
      if (this.buttonEnablerFlags.upload) {
        const { league, from, to } = this.form;
        this.$vs.dialog({
          color: "success",
          title: "Download data from Database!",
          text: `Are you sure you want to download data for ${
            league ? this.leaguesNames[league] : "All leagues"
          } from ${from} to ${to}?`,
          accept: () => this.downloadHandler(),
        });
      } else {
        this.$vs.dialog({
          color: "warning",
          title: "Incorrect Download!",
          text: "Please upload data first!",
        });
      }
    },
    syncDialog() {
      if (this.buttonEnablerFlags.download) {
        const { league, from, to } = this.form;
        this.$vs.dialog({
          color: "success",
          title: `Sync points for ROUND ${this.currentRound}!`,
          text: `Are you sure you want points for ${
            league ? this.leaguesNames[league] : "All leagues"
          } from ${from} to ${to} to be added to round ${
            this.selectedSyncRound ? this.selectedSyncRound : this.currentRound
          }?`,
          accept: () => this.syncPointsHandler(),
        });
      } else {
        this.$vs.dialog({
          color: "warning",
          title: "Incorrect Sync!",
          text: "Please upload data first and then download it!",
        });
      }
    },
    async uploadHandler() {
      this.$vs.loading();
      const { league, from, to, format, target } = this.form;
      const { proxyUrl, toolUrl } = this;
      await this.deletePreviousUpload();
      fetch(
        `${proxyUrl}${toolUrl}?league=${league}&from=${from}&till=${to}&format=${format}&target=${target}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then(async () => {
          this.$vs.loading.close();
          this.lastUpdate = await this.uploadNewUpdateDate();
          this.isLeagueSelected = league ? true : false;
          this.buttonEnablerFlags.upload = true;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
          this.errorMsg = err;
          this.$vs.loading.close();
        });
    },
    async deletePreviousUpload() {
      return await fetch(`${DATA_URL}pointsSync/points.json`, {
        method: "DELETE",
      });
    },
    async downloadHandler() {
      this.$vs.loading();
      try {
        this.points = await getPointsFromTool(this.isLeagueSelected);
        this.buttonEnablerFlags.download = true;
      } catch (err) {
        this.$vs.loading.close();
        console.log(err);
        this.error = true;
        this.errorMsg = err;
      }
    },
    async syncPointsHandler() {
      this.$vs.loading();
      const round = this.selectedSyncRound
        ? this.selectedSyncRound
        : this.currentRound;

      if (this.points !== "empty") {
        const updatedPlayers = await syncPointsHelper(
          this.points,
          this.players,
          round
        );
        const standings = await newStandingsHelper(
          updatedPlayers,
          this.users,
          this.leagues,
          round,
          false
        );
        // const standings = await standingsHelper(
        //   this.standings,
        //   this.leagues,
        //   updatedPlayers,
        //   this.users,
        //   round
        // );
        // console.log(standings, this.points);
        this.fetchUpdatedPlayersObject(updatedPlayers);

        // UPDATE LAST_UPDATE_DATE FOR THE CACHE
        setLastUpdateDB()

        await this.deleteStandings();
        this.fetchUpdatedStandingsObject1(standings);
        // this.fetchUpdatedStandingsObject(standings);
      } else {
        this.lastSync = await this.uploadNewSyncDate();
        this.buttonEnablerFlags.sync = true;

        const standings = await newStandingsHelper(
          this.players,
          this.users,
          this.leagues,
          round - 1,
          true
        );
        await this.deleteStandings();
        this.fetchUpdatedStandingsObject1(standings);

        // UPDATE LAST_UPDATE_DATE FOR THE CACHE
        setLastUpdateDB()

        
        // this.fetchUpdatedStandingsObject(
        //   this.standings[`r${this.selectedSyncRound - 1}`]
        // );
        this.$vs.loading.close();
      }
    },
    fetchUpdatedPlayersObject(payload) {
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
          console.log("Success!");
          this.$vs.loading.close();
          this.lastSync = await this.uploadNewSyncDate();

          updateLightPlayers()

          this.buttonEnablerFlags.sync = true;
        })
        .catch((err) => {
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then(async () => {
          console.log("Success!");
          // this.standings = data;
        })
        .catch((err) => {
          console.error("Error:", err);
          this.$vs.loading.close();
          this.error = true;
          this.errorMsg = err;
        });
    },
    async deleteStandings() {
      return await fetch(`${DATA_URL}newstandings.json`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {})
        .catch((error) => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    fetchUpdatedStandingsObject(payload) {
      return fetch(`${DATA_URL}standings/r${this.selectedSyncRound}.json`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then(async (data) => {
          console.log("Success!");
          this.standings = data;
        })
        .catch((err) => {
          console.error("Error:", err);
          this.$vs.loading.close();
          this.error = true;
          this.errorMsg = err;
        });
    },
    async uploadNewUpdateDate() {
      const date = new Date(new Date().getTime());
      const response = await fetch(`${DATA_URL}pointsSync.json`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          lastUpdate: date,
        }),
      });
      const result = await response.json();
      return result.lastUpdate;
    },
    async uploadNewSyncDate() {
      const date = new Date(new Date().getTime());
      const response = await fetch(`${DATA_URL}pointsSync.json`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          lastSync: date,
        }),
      });
      const result = await response.json();
      return result.lastSync;
    },
    async getLastUpdate() {
      const response = await fetch(this.lastUpdateUrl);
      const date = await response.json();
      return date.split("T").join(" ").split(".").shift();
    },
    async getLastSync() {
      const response = await fetch(this.lastSyncUrl);
      const date = await response.json();
      return date.split("T").join(" ").split(".").shift();
    },
    selectRoundDates(rnd) {
      const round = this.roundDates[rnd];
      this.form.from = round.from;
      this.form.to = round.to;
    },
    selectSyncRoundHandler(rnd) {
      return (this.selectedSyncRound = rnd);
    },
  },
  computed: {},
  watch: {
    points(nv) {
      if (nv) {
        this.$vs.loading.close();
      }
    },
    players(nv) {
      if (nv) {
        this.$vs.loading.close();
      }
    },
  },
  async created() {
    this.$vs.loading();
    this.players = await getAllPlayersDataNormal();
    this.leagues = await getAllLeagues();
    this.users = await getAllUsers();
    this.standings = await getStandings();
    const uploadDate = await this.getLastUpdate();
    this.lastUpdate = uploadDate ? uploadDate : "No Upload Date!";

    const syncDate = await this.getLastSync();
    this.lastSync = syncDate ? syncDate : "No Sync Date!";

    this.currentRound = await getCurrentRound();
  },
};
</script>

<style lang="scss">
.sync-points-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  con-vs-alert-danger {
    background-color: #e5000059;
    color: white;
    font-weight: bold;
    padding: 5px;
    width: 98%;
    margin: 10px 0 0 0;
  }

  h3 {
    width: 100%;
    font-size: 1.2rem;
    text-align: center;
    margin: 30px 0 0 0;
  }

  .sync-section {
    width: 97%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    margin: 20px 0 0 0;
    background-color: #afafaf;
    border-radius: 10px;
    padding: 10px;

    &:nth-child(4) {
      flex-direction: row;
    }

    p {
      font-weight: bold;
    }

    .rounds {
      padding: 0 0 10px 0;
      border-bottom: 1px solid #3c474d;
      a {
        display: inline-block;
        padding: 5px;
        transition: all 0.3s;
        color: black;
        border-radius: 3px;
        margin: 0 1px 0 1px;

        &:hover {
          background-color: #59a95d;
        }

        &.selected {
          background-color: #356538;
          color: white;
        }
        &.unavailable {
          background-color: #9d9d9d;
          cursor: not-allowed;
        }
      }
    }

    .form-container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: row;

      .download {
        //   padding: 32px;
        width: 50%;

        input[name="target"] {
          width: 100%;
        }

        label {
          display: flex;
          margin: 16px 0;
          justify-content: flex-start;
          align-items: center;

          span {
            flex: 0 0 100px;
          }

          select,
          input {
            border-radius: 4px;
            border: 1px solid #dcdcdc;
            padding: 0.3em;
            background: white;
            font-family: "PT Sans", sans-serif;
            font-size: large;
          }
        }
      }
    }

    img {
      margin: 0 40px 0 25%;
      width: 50px;
    }

    .sync-container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: row;
      margin: 20px 0 0 0;
    }
  }

  @media (max-width: 800px) {
    .download {
      padding: 16px;
    }
  }
}
</style>