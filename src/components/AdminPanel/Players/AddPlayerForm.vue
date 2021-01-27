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
      >Player succesfully added!</vs-alert
    >
    <form @submit.prevent="addPlayerHandler">
      <label class="select">
        Country: {{ newPlayer.country }}
        <select
          label="Leagues"
          v-model="newPlayer.country"
          placeholder="Select a league"
        >
          <option :key="l" :value="l" v-for="l in Object.keys(players)">{{
            countryMap[l]
          }}</option>
        </select>
      </label>

      <!-- <vs-select label="Leagues" v-model="newPlayer.country" icon placeholder="Select a league">
        <vs-select-item :key="l" :value="l" :text="l" v-for="l in Object.keys(players)" />
      </vs-select> -->

      <label class="select" v-if="newPlayer.country">
        Club: {{ newPlayer.club }}
        <select
          v-if="newPlayer.country"
          label="Clubs"
          v-model="newPlayer.club"
          placeholder="Select team"
        >
          <option
            :key="p"
            :value="p"
            v-for="p in Object.keys(players[newPlayer.country])"
            >{{ p }}</option
          >
        </select>
      </label>

      <!-- <vs-select
        v-if="newPlayer.country"
        label="Clubs"
        v-model="newPlayer.club"
        icon
        placeholder="Select team"
      >
        <vs-select-item
          :key="p"
          :value="p"
          :text="p"
          v-for="p in Object.keys(players[newPlayer.country])"
        />
      </vs-select> -->
      <vs-input
        label="Name"
        placeholder="Insert player name"
        v-model="newPlayer.name"
      />
      <label class="select">
        Position: {{ newPlayer.position }}
        <select
          label="Position"
          v-model="newPlayer.position"
          placeholder="Select position"
        >
          <option :key="pos" :value="pos" v-for="pos in positions">{{
            pos
          }}</option>
        </select>
      </label>

      <!-- <vs-select label="Position" v-model="newPlayer.position" icon placeholder="Select position">
        <vs-select-item :key="pos" :value="pos" :text="pos" v-for="pos in positions" />
      </vs-select> -->

      <vs-button color="#59A95D" button="submit" type="relief" size="large"
        >Add Player</vs-button
      >
    </form>
  </div>
</template>

<script>
import { teamCodes, DATA_URL, countryMap } from "../../../common";
import { addPlayerPts, makeNewPlayer } from "../../../models/Player";
import { getAllPlayersDataCathegorized } from "../../../utils/getAllPlayersData";
import { v4 as uuidv4 } from "uuid";
import { getCurrentRound } from "../../../utils/getCurrentRound";
import { setLastUpdateDB } from '../../../utils/setLastUpdate';
import updateLightPlayers from '../../../utils/updateLightPlayers';

export default {
  name: "AddPlayerForm",
  props: {
    players: {
      required: true,
      type: Object
    },
    leagueSelected: {
      type: String
    },
    teamSelected: {
      type: String
    }
  },
  data() {
    return {
      newPlayer: {},
      showClub: false,
      positions: ["GK", "DL", "DC", "DR", "ML", "MC", "MR", "ST"],
      error: false,
      errorMsg: "",
      success: false,
      countryMap: countryMap
    };
  },
  methods: {
    addPlayerHandler() {
      if (this.isNewPlayerOK()) {
        const { country, club, name, position, shirt } = this.newPlayer;
        const id = uuidv4();
        const player = makeNewPlayer(name, position, club, shirt, id, country);
        player["points"] = this.createPlayerPointsObj(this.currentRound);
        this.uploadNewPlayer(player);
      }
    },
    createPlayerPointsObj(rnd) {
      const playerStatsEmptyValues = Array(20).fill("");
      let result = {};
      for (let i = 0; i < rnd; i++) {
        result[`r${i + 1}`] = addPlayerPts(0, ...playerStatsEmptyValues);
      }
      return result;
    },
    isNewPlayerOK() {
      const { country, club, name, position } = this.newPlayer;
      if (country && club && name && position) {
        if (this.players[country] && this.players[country][club]) {
          return true;
        } else {
          this.errorMsg = "Club and country do not match!";
          this.error = true;
          return false;
        }
      } else {
        this.errorMsg = "Please fill all fields!";
        this.error = true;
        return false;
      }
    },
    uploadNewPlayer(payload) {
      return fetch(`${DATA_URL}players/${payload.id}.json`, {
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
          const updatedPlayers = await getAllPlayersDataCathegorized();
          setLastUpdateDB()
          updateLightPlayers()
          this.$emit("updatedPlayers", updatedPlayers);
          this.$parent.$emit("close", false);
        })
        .catch(err => {
          console.error("Error:", err);
          this.error = true;
          this.errorMsg = err;
        });
    }
  },
  computed: {},
  watch: {
    // leagueSelected(nv) {
    //   if (nv) {
    //     this.newPlayer.country = nv;
    //   }
    // },
    // teamSelected(nv) {
    //   if (nv) {
    //     this.newPlayer.club = nv;
    //   }
    // },
    "newPlayer.club": function(nv) {
      if (nv) {
        this.newPlayer["shirt"] = teamCodes[nv];
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
    // this.newPlayer.country = this.leagueSelected;
    // this.newPlayer.club = this.teamSelected;

    this.currentRound = await getCurrentRound();
  }
};
</script>

<style lang="scss">
.add-form-container {
  form {
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

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