<template>
  <div>
    <div class="pagination">
      <vs-pagination
        :total="Math.ceil(Object.keys(emptyMatching).length / 30)"
        v-model="page"
      ></vs-pagination>
    </div>
    <div class="search-bar">
      <label>
        Search player name and team!
        <input type="text" v-model="keyword" />
      </label>
    </div>

    <form
      class="matching-container"
      @submit.prevent="updateMatchingHandler"
      v-if="players && matchingData"
    >
      <vs-button
        color="#59A95D"
        button="submit"
        type="relief"
        size="normal"
        @click.prevent="test"
        >TEST</vs-button
      >
      <vs-alert
        v-if="success"
        title="Update finished!"
        active="true"
        color="success"
        >Matching successfully updated!</vs-alert
      >
      <h3>Unmatched players: {{ Object.keys(emptyMatching).length }}</h3>
      <div class="player" v-for="player in pageChunk" :key="player">
        <div
          class="player-name-club"
          :class="{ selected: checkAvailability(player) }"
        >
          <span>{{ players[player].name }}</span>
          <span>{{ players[player].club }}</span>
        </div>
        <input type="text" v-model="updatedMatching[player]" />
        <button
          class="delete-player"
          @click.prevent="deletePlayerHandler(player)"
        >
          Delete Player
        </button>
      </div>

      <vs-button
        class="btn"
        color="#59A95D"
        button="submit"
        type="relief"
        size="large"
        >Submit Matching</vs-button
      >
    </form>
  </div>
</template>

<script>
import { getAllPlayersDataNormal } from "../../../utils/getAllPlayersData";
import getMatching from "../../../utils/getMatching";
import { DATA_URL } from "../../../common";
// import AddPlayerForm from "./AddPlayerForm";
import "material-icons/iconfont/material-icons.css";

export default {
  name: "Matching",
  components: {},
  data() {
    return {
      page: 1,
      matchingData: undefined,
      updatedMatching: {},
      // showPopup: false,
      players: undefined,
      keyword: "",
      // leagueSelected: "",
      // teamSelected: "",
      // playerSelected: "",
      // playerEdited: {
      //   club: "",
      //   country: "",
      //   id: "",
      //   name: "",
      //   position: "",
      //   shirt: ""
      // },
      // positions: ["GK", "DL", "DC", "DR", "ML", "MC", "MR", "ST"],
      success: false,
    };
  },
  methods: {
    reverseUpdatedMatching(obj) {
      return Object.keys(obj).reduce((result, key) => {
        result[obj[key].trim()] = key;
        return result;
      }, {});
    },
    updateMatchingHandler() {
      const payload = this.reverseUpdatedMatching(this.updatedMatching);

      this.$vs.dialog({
        color: "success",
        title: "Confirm Matching",
        text: this.showSuccessMsg(payload),
        accept: () => this.fetchUpdatedMatching(payload),
      });
    },
    fetchUpdatedMatching(payload) {
      return fetch(`${DATA_URL}matching.json`, {
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
          this.matchingData = await getMatching();
          this.success = true;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    showSuccessMsg(obj) {
      const length = Object.keys(obj).length;
      return `Are you sure you want to update ${length} player${
        length === 1 ? "" : "s"
      }?`;
    },
    checkAvailability(pl) {
      return Object.values(this.players[pl].available).includes(false);
    },
    deletePlayerHandler(id) {
      this.$vs.dialog({
        color: "success",
        title: "Confirm Delete",
        text: `Are you sure you want to delete ${this.players[id].name}?`,
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
            this.matchingData = await getMatching();
            this.success = true;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };
    },
  },
  computed: {
    emptyMatching() {
      if (this.players && this.matchingData) {
        const matched = Object.values(this.matchingData);
        const players = Object.keys(this.players);
        const result = players
          .filter((player) => {
            if (!matched.includes(player)) {
              return player;
            }
          })
          .sort((a, b) => {
            return this.players[a].club.localeCompare(this.players[b].club);
          })
          .sort((a, b) => {
            const check1 = this.checkAvailability(a);
            const check2 = this.checkAvailability(b);
            if (check1) return -1;
            else if (check2) return 1;
          })
          .filter((id) => {
            if (this.keyword) {
              const player = this.players[id];
              const name = player.name.toLowerCase().trim();
              const club = player.club.toLowerCase().trim();
              const keyword = this.keyword.toLowerCase().trim();
              if (name.includes(keyword) || club.includes(keyword)) {
                return id;
              }
            } else return id;
          });
        return result;
      } else return "";
    },
    pageChunk() {
      const multiplier = 30;
      const result = this.emptyMatching.filter((x, i) => {
        if (i >= multiplier * (this.page - 1) && i <= multiplier * this.page) {
          return x;
        }
      });
      return result;
    },
  },
  watch: {
    matchingData(nv) {
      if (nv && this.players) {
        this.$vs.loading.close();
      }
    },
    players(nv) {
      if (nv && this.matchingData) {
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
    this.players = await getAllPlayersDataNormal();
    this.matchingData = await getMatching();
  },
  beforeDestroy() {
    console.log("destroy", this.players);
    this.players = null;
    this.matchingData = null;
    console.log("destroyed", this.players);
  },
};
</script>

<style scoped lang="scss">
.pagination {
  width: 50%;
  margin: 20px 0 0 0;
}

.search-bar {
  width: 100%;
  label {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 20px 0 0 20px;
    font-size: 1.2rem;
    input {
      width: 30%;
      font-size: 1.3rem;
      padding: 5px;
      margin: 10px 0 0 0;
      transition: all 0.3s;
    }
  }
}
.matching-container {
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px 0 0 20px;

  .con-vs-alert-success {
    background: #46c93a80;
    color: white;
    margin: 15px;
    width: 97%;
  }

  h3 {
    font-weight: bold;
    width: 100%;
    text-align: center;
    padding: 5px;
    margin: 0 0 20px 0;
  }

  .player {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 3px 0 3px 0;
    padding: 5px;
    transition: all 0.3s;
    border-radius: 5px;

    &:hover {
      background-color: #afafaf;
    }
    .player-name-club {
      width: 70%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .selected {
      background-color: #ff9797;
      padding: 5px;
    }
    input {
      padding: 5px;
      width: 25%;
    }
    .delete-player {
      width: 20%;
      margin: 0 0 0 10px;
      border-radius: 5px;
      border: none;
      padding: 5px;
      transition: all 0.2s;
      background-color: #ff9797;
      &:hover {
        background-color: #d66161;
      }
    }
  }
}
</style>