<template>
  <div class="players-edit-container">
    <h1 class="section-header">Edit Players personal details section</h1>
    <!-- CREATE NEW PLAYER BUTTON and POPUP -->
    <vs-popup
      class="holamundo"
      title="Create new player!"
      :active.sync="showPopup"
      v-if="players"
      @close="closePopup"
    >
      <AddPlayerForm
        :players="players"
        @updatedPlayers="players = $event"
        :leagueSelected="leagueSelected"
        :teamSelected="teamSelected"
      />
    </vs-popup>
    <vs-button
      class="add-player"
      color="#59A95D"
      button="button"
      type="relief"
      size="large"
      @click.prevent="openAddPlayerPopup"
      >Add New Player</vs-button
    >

    <!-- LEAGUES -->
    <div class="leagues-container" v-if="players">
      <a
        v-for="l in Object.keys(players)"
        :key="l"
        @click.prevent="selectLeagueHandler(l)"
        :class="{ selected: leagueSelected === l }"
        class="edit-player-menu-item"
      >
        <!-- <img
          :src="
            require(`@/assets/images/user-transfers/leagues/${makeLeagueToImg(
              l
            )}.png`)
          "
          :alt="l"
        /> -->
        <img
          :src="`https://ff-legends.com/team-logos/${makeLeagueToImg(l)}.png`"
          alt="league"
        />
      </a>
    </div>
    <!-- TEAMS -->
    <div class="teams-container" v-if="players && leagueSelected">
      <a
        v-for="(t, i) in Object.keys(players[leagueSelected])"
        :key="i"
        @click.prevent="selectTeamHandler(t)"
        class="edit-player-menu-item"
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
        <a
          v-for="p in sortedPlayers(
            Object.values(players[leagueSelected][teamSelected])
          )"
          :key="p.id"
          @click.prevent="selectPlayerHandler(p)"
          class="edit-player-menu-item"
          :class="{ selected: playerSelected === p }"
          >{{ p.name }} - {{ p.position }}</a
        >
      </div>

      <!-- EDIT FORM -->
      <div class="players-details-edit" v-if="playerSelected">
        <form @submit.prevent="editPlayerFormHandler">
          <label class="select">
            Country:
            <select
              v-model="playerEdited.country"
              @change="playerEdited.club = ''"
            >
              <option :key="l" :value="l" v-for="l in Object.keys(players)">
                {{ countryMap[l] }}
              </option>
            </select>
            <!-- <vs-select
              :label="playerSelected.country"
              v-model="playerEdited.country"
              icon
              @change="playerEdited.club = ''"
            >
              <vs-select-item
                :key="l"
                :value="l"
                :text="l"
                v-for="l in Object.keys(players)"
              />
            </vs-select> -->
          </label>
          <label class="select">
            Club:
            <select
              v-if="players[playerEdited.country]"
              :label="playerSelected.club"
              v-model="playerEdited.club"
            >
              <option
                :key="l"
                :value="l"
                v-for="l in Object.keys(players[playerEdited.country])"
              >
                {{ l }}
              </option>
            </select>

            <select
              v-else
              :label="playerSelected.club"
              v-model="playerEdited.club"
              icon
            >
              <option
                :key="l"
                :value="l"
                v-for="l in Object.keys(players[leagueSelected])"
              >
                {{ l }}
              </option>
            </select>
            <!-- <vs-select
              v-if="players[playerEdited.country]"
              :label="playerSelected.club"
              v-model="playerEdited.club"
              icon
            >
              <vs-select-item
                :key="l"
                :value="l"
                :text="l"
                v-for="l in Object.keys(players[playerEdited.country])"
              />
            </vs-select>

            <vs-select
              v-else
              :label="playerSelected.club"
              v-model="playerEdited.club"
              icon
            >
              <vs-select-item
                :key="l"
                :value="l"
                :text="l"
                v-for="l in Object.keys(players[leagueSelected])"
              />
            </vs-select> -->
          </label>
          <label>
            Name:
            <vs-input
              :label-placeholder="playerSelected.name"
              v-model="playerEdited.name"
              color="dark"
            />
          </label>
          <label class="select">
            Position:
            <select
              :label="playerSelected.position"
              v-model="playerEdited.position"
            >
              <option :key="pos" :value="pos" v-for="pos in positions">
                {{ pos }}
              </option>
            </select>
            <!-- <vs-select
              :label="playerSelected.position"
              v-model="playerEdited.position"
              icon
            >
              <vs-select-item
                :key="pos"
                :value="pos"
                :text="pos"
                v-for="pos in positions"
              />
            </vs-select> -->
          </label>
          <label v-for="league in Object.keys(leagues)" :key="league">
            <input
              type="checkbox"
              @click="selectPlayerAvailability($event, league)"
            />
            <span
              :style="`color:${
                playerSelected.available[league] ? 'green' : 'red'
              }`"
              >Current status {{ leagues[league] }}:
              {{ playerSelected.available[league] ? "IS" : "NOT" }}
              available!</span
            >
            <span
              v-if="typeof playerEditedAvail[league] === 'boolean'"
              :style="`color:${playerEditedAvail[league] ? 'green' : 'red'}`"
              >New status {{ leagues[league] }}:
              {{ playerEditedAvail[league] ? "IS" : "NOT" }} available!</span
            >
          </label>

          <vs-button color="#59A95D" button="submit" type="relief" size="large"
            >Edit Player</vs-button
          >
          <vs-button
            color="danger"
            button="button"
            type="relief"
            size="large"
            @click.prevent="deletePlayerHandler(playerSelected.id)"
            >Delete Player</vs-button
          >
        </form>

        <vs-alert
          v-if="success"
          title="Update finished!"
          active="true"
          color="success"
          >Player succesfully updated!</vs-alert
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getAllPlayersDataCathegorized } from "../../../utils/getAllPlayersData";
import { teamCodes, DATA_URL, countryMap } from "../../../common";
import AddPlayerForm from "./AddPlayerForm";
import { setLastUpdateDB } from "../../../utils/setLastUpdate";
import updateLightPlayers from "../../../utils/updateLightPlayers";

export default {
  name: "PlayersEdit",
  components: {
    AddPlayerForm,
  },
  data() {
    return {
      leagues: {
        "33c46ff1-1756-41a1-a80f-01b2f4fb4b3c": "Pele",
        "60e2f9e6-af52-4b5e-8918-94d9c79fd1c4": "Maradona",
      },
      showPopup: false,
      players: undefined,
      leagueSelected: "",
      teamSelected: "",
      playerSelected: "",
      playerEdited: {
        club: "",
        country: "",
        id: "",
        name: "",
        position: "",
        shirt: "",
      },
      playerEditedAvail: {},
      positions: ["GK", "DL", "DC", "DR", "ML", "MC", "MR", "ST"],
      success: false,
      countryMap: countryMap,
    };
  },
  methods: {
    closePopup() {
      return (this.showPopup = false);
    },
    selectPlayerAvailability(e, league) {
      const result = e.target.checked;
      return this.$set(this.playerEditedAvail, league, result);
    },
    makeLeagueToImg(v) {
      return v.toLowerCase().split(" ").join("-");
    },
    selectLeagueHandler(l) {
      this.teamSelected = "";
      return (this.leagueSelected = l);
    },
    selectTeamHandler(t) {
      this.playerSelected = "";
      return (this.teamSelected = t);
    },
    selectPlayerHandler(p) {
      this.playerEdited = {
        club: "",
        country: "",
        id: "",
        name: "",
        position: "",
        shirt: "",
      };
      this.deselectPlayerAvail();
      return (this.playerSelected = p);
    },
    mergePlayers(_new, _old) {
      let result = {};
      Object.keys(_old).forEach((atttr) => {
        if (_new[atttr]) {
          result[atttr] = _new[atttr];
        } else {
          result[atttr] = _old[atttr];
        }
      });
      if (_new["club"]) {
        result["shirt"] = teamCodes[_new["club"]];
      }
      Object.keys(this.leagues).forEach((l) => {
        result.available[l] =
          typeof this.playerEditedAvail[l] === "boolean"
            ? this.playerEditedAvail[l]
            : _old.available[l];
      });
      return result;
    },
    showSuccessMsg({ club, country, name, position }) {
      return `You are about to edit ${name}!\nLeague: ${country},\nClub: ${club},\nName: ${name},\nPosition: ${position}`;
    },
    fetchDataToPlayer(payload) {
      return fetch(`${DATA_URL}players/${payload.id}.json`, {
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
          this.$vs.loading();
          this.deselectPlayer();
          this.players = await getAllPlayersDataCathegorized();
          setLastUpdateDB();
          updateLightPlayers();
          this.success = true;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    editPlayerFormHandler() {
      const payload = this.mergePlayers(this.playerEdited, this.playerSelected);
      console.log(payload);
      if (this.players[payload.country][payload.club]) {
        this.$vs.dialog({
          color: "success",
          title: "Confirm Edit",
          text: this.showSuccessMsg(payload),
          accept: () => this.fetchDataToPlayer(payload),
        });
      } else {
        this.$vs.dialog({
          color: "warning",
          title: "Incorrect Edit",
          text: "There is no such club in this league!",
        });
      }
    },
    openAddPlayerPopup() {
      return (this.showPopup = true);
    },
    deletePlayerHandler(id) {
      this.$vs.dialog({
        color: "success",
        title: "Confirm Delete",
        text: `Are you sure you want to delete ${
          this.players[this.leagueSelected][this.teamSelected][id].name
        }?`,
        accept: () => deletePlayer(id),
      });

      const deletePlayer = (id) => {
        return fetch(`${DATA_URL}players/${id}.json`, {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then(async () => {
            this.playerSelected = "";
            this.$vs.loading();
            this.players = await getAllPlayersDataCathegorized();
            setLastUpdateDB();
            updateLightPlayers();
            this.$vs.loading.close();
            this.success = true;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };
    },
    sortedPlayers(arr) {
      return arr.sort((a, b) => {
        return a.position.localeCompare(b.position);
      });
    },
    deselectPlayer() {
      return (this.playerSelected = "");
    },
    deselectPlayerAvail() {
      return (this.playerEditedAvail = {});
    },
  },
  computed: {},
  watch: {
    players(nv) {
      if (nv) {
        this.$vs.loading.close();
      }
    },
    success(nv) {
      if (nv === true) {
        setTimeout(() => {
          this.success = false;
        }, 2000);
      }
    },
  },
  async created() {
    this.$vs.loading();
    this.players = await getAllPlayersDataCathegorized();
  },
};
</script>

<style lang="scss">
select {
  width: 50%;
}
.players-edit-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .add-player {
    margin: 10px;
  }

  .leagues-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin: 20px 0 0 0;

    a.edit-player-menu-item {
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

    a.edit-player-menu-item {
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
      width: 25%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin: 0 0 0 20px;
      background-color: #b4b4b4;
      border-radius: 5px;
      padding: 5px 10px;

      a.edit-player-menu-item {
        width: 100%;
        transition: all 0.3s;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 4px;
        border-radius: 5px;
        text-align: center;

        &:hover {
          cursor: pointer;
          background-color: #71b171;
        }
        &:active {
          background-color: #71b171;
        }
        &.selected {
          background-color: #59a959;
        }
        img {
          width: 60%;
        }
      }
    }

    .players-details-edit {
      width: 80%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin: 0 0 0 20px;
      background-color: #b4b4b4;
      border-radius: 5px;
      padding: 20px 20px;

      form {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        & > label {
          width: 50%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin: 15px 0 0 0;
          border-bottom: 1px solid #7c7c7c;
          padding: 0 0 10px 0;

          &:last-child {
            border: none;
          }

          & > div {
            font-weight: bold;
            margin: 0px;
          }

          input[type="checkbox"] {
            margin: 0 10px 0 0;
            width: 20px;
            height: 20px;
          }
        }
        button {
          margin: 15px 0 0 0;
        }
      }

      .con-vs-alert-success {
        background: #46c93a80;
        color: white;
        margin: 15px 0 0 0;
      }
    }
  }
}
</style>