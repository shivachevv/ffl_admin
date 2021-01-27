<template>
  <div class="users-container">
    <h1 class="section-header">Edit User Teams Section</h1>

    <div class="user-selection">
      <label class="select">
        Users:
        <select v-if="users" v-model="selectedUser" icon>
          <option :key="u.uid" :value="u" v-for="u in Object.values(users)">{{
            u.userTeam
          }}</option>
        </select>
      </label>
      <!-- <label>
        Users:
        <vs-select v-if="users" v-model="selectedUser" icon>
          <vs-select-item
            :key="u.uid"
            :value="u"
            :text="u.userTeam"
            v-for="u in Object.values(users)"
          />
        </vs-select>
      </label> -->
    </div>
    <vs-alert
      v-if="success"
      title="Update finished!"
      active="true"
      color="success"
      >User succesfully updated!</vs-alert
    >
    <vs-alert :active.sync="error" closable close-icon="close">{{
      errorMsg
    }}</vs-alert>

    <!-- USER SELECTED -->
    <div class="user-details" v-if="selectedUser">
      <h2>Selected User: {{ selectedUser.email }}</h2>
      <div class="rounds">
        <a
          href
          v-for="rnd in currentRound"
          :key="rnd"
          @click.prevent="selectRoundHandler(rnd)"
          :class="{ selected: rnd === selectedRound }"
          >{{ rnd }}</a
        >
      </div>

      <div class="players-container" v-if="selectedRound && selectedUserTeam">
        <h3>{{ selectedUser.email }} team for round: {{ selectedRound }}</h3>
        <div class="player" v-for="player in selectedUserTeam" :key="player">
          <span class="pos">{{ players[player].position }}</span>
          <span class="name">{{ players[player].name }}</span>
          <span class="points"
            >{{
              players[player].points[`r${selectedRound}`].roundPts
            }}
            pts</span
          >

          <span
            class="cap"
            v-if="selectedUser.rounds[`r${selectedRound}`].cpt === player"
            >C</span
          >
          <span
            class="vc"
            v-if="selectedUser.rounds[`r${selectedRound}`].viceCpt === player"
            >VC</span
          >
        </div>
        <div class="form-container">
          <div class="round-total">Total Round Points: {{ roundTotal }}</div>
          <form @submit.prevent="changeCaptainsHandler">
            <label>
              Change Captain for the round
              <vs-select label="New captain" v-model="newCpt" icon>
                <vs-select-item
                  v-for="player in selectedUserTeam"
                  :key="player"
                  :value="player"
                  :text="
                    `${players[player].name} - ${players[player].position}`
                  "
                />
              </vs-select>
            </label>
            <label>
              Change Vice-Captain for the round
              <vs-select label="New Vice-Captain" v-model="newViceCpt" icon>
                <vs-select-item
                  v-for="player in selectedUserTeam"
                  :key="player"
                  :value="player"
                  :text="
                    `${players[player].name} - ${players[player].position}`
                  "
                />
              </vs-select>
            </label>
            <vs-button
              color="#59A95D"
              button="submit"
              type="relief"
              size="normal"
              >Update Captains</vs-button
            >
          </form>
        </div>
      </div>
      <div v-else>
        User does not have a team selected for round {{ selectedRound }}!
      </div>
      <!-- <form @submit.prevent="editUserTeamFormHandler">
        <label>
          Email:
          <vs-input :label-placeholder="selectedUser.email" v-model="userEdited.email" icon />
        </label>
        <label>
          User Team Name:
          <vs-input :label-placeholder="selectedUser.userTeam" v-model="userEdited.userTeam" icon />
        </label>
        <label>
          User Age:
          <vs-input
            type="number"
            :label-placeholder="selectedUser.age"
            v-model="userEdited.age"
            icon
          />
        </label>
        <label>
          User Favourite Team:
          <vs-input :label-placeholder="selectedUser.favTeam" v-model="userEdited.favTeam" icon />
        </label>
        <label>
          User Location:
          <vs-input :label-placeholder="selectedUser.location" v-model="userEdited.location" icon />
        </label>
        <label>
          User Motto:
          <vs-input :label-placeholder="selectedUser.motto" v-model="userEdited.motto" icon />
        </label>
        <label>
          User Ocupation:
          <vs-input
            :label-placeholder="selectedUser.ocupation"
            v-model="userEdited.ocupation"
            icon
          />
        </label>
        <label>
          <input type="checkbox" v-model="userEdited.isAdmin" />
          User Admin Rights. Currently user is {{selectedUser.isAdmin ? '' : 'NOT'}} an admin!
        </label>

        <div class="buttons">
          <vs-button color="#59A95D" button="submit" type="relief" size="large">Edit User Team</vs-button>
        </div>
      </form>-->
    </div>
  </div>
</template>

<script>
import { getAllPlayersDataNormal } from "../../../utils/getAllPlayersData";
import { DATA_URL } from "../../../common";
import getAllUsers from "../../../utils/getAllUsers";
import { getCurrentRound } from "../../../utils/getCurrentRound";
import roundPointsCalculator from "../../../utils/roundPointsCalculator";

export default {
  name: "UsersTeams",
  components: {},
  data() {
    return {
      users: undefined,
      players: undefined,
      selectedUser: undefined,
      selectedRound: undefined,
      selectedUserTeam: undefined,
      userEdited: {},
      success: false,
      error: false,
      errorMsg: "",
      newCpt: "",
      newViceCpt: ""
      // roundTotal: 0
    };
  },
  methods: {
    // editUserTeamFormHandler() {
    //   return;
    // },
    selectRoundHandler(r) {
      this.selectedRound = r;

      if (this.selectedUser.rounds) {
        if (this.selectedUser.rounds[`r${r}`]) {
          if (this.selectedUser.rounds[`r${r}`].team) {
            this.selectedUserTeam = this.selectedUser.rounds[`r${r}`].team;
            // this.calcRoundTotalPts();
          } else {
            this.selectedUserTeam = undefined;
          }
        } else {
          this.selectedUserTeam = undefined;
        }
      } else {
        this.selectedUserTeam = undefined;
      }
    },
    changeCaptainsHandler() {
      const oldCpt = this.selectedUser.rounds[`r${this.selectedRound}`].cpt;
      const oldViceCpt = this.selectedUser.rounds[`r${this.selectedRound}`]
        .viceCpt;
      const updatedCpt = this.newCpt ? this.newCpt : oldCpt;
      const updatedVCpt = this.newViceCpt ? this.newViceCpt : oldViceCpt;

      if (updatedCpt === updatedVCpt) {
        return this.$vs.dialog({
          color: "danger",
          title: "Please change Captain and ViceCaptain!",
          text: "Captain and ViceCaptain should not be the same!"
        });
      } else {
        return this.$vs.dialog({
          color: "success",
          title: "Confirm Edit",
          text: this.showSuccessMsg(updatedCpt, updatedVCpt),
          accept: () => this.fetchEditedCaptains(updatedCpt, updatedVCpt)
        });
      }
    },
    fetchEditedCaptains(newC, newVC) {
      const { uid } = this.selectedUser;
      const payload = {
        cpt: newC,
        viceCpt: newVC
      };
      return fetch(
        `${DATA_URL}users/${uid}/rounds/r${this.selectedRound}.json`,
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
        .then(async data => {
          console.log("Success:", data);
          this.success = true;
          this.deselectUser();
          this.$vs.loading();
          this.users = await getAllUsers();
        })
        .catch(error => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    // editUserFormHandler() {
    //   const merged = this.mergeUsers(this.userEdited, this.selectedUser);
    //   const {
    //     uid,
    //     email,
    //     userTeam,
    //     age,
    //     location,
    //     ocupation,
    //     favTeam,
    //     motto
    //   } = merged;
    //   const newUser = makeNewUser(
    //     uid,
    //     email,
    //     userTeam,
    //     age,
    //     location,
    //     ocupation,
    //     favTeam,
    //     motto
    //   );

    //   return this.$vs.dialog({
    //     color: "success",
    //     title: "Confirm Edit",
    //     text: this.showSuccessMsg(newUser),
    //     accept: () => this.fetchEditedUser(newUser)
    //   });
    // },
    showSuccessMsg(C, VC) {
      return `Are you sure you want to change
              Captain to: ${this.players[C].name}
              and Vice Captain to ${this.players[VC].name}?`;
    },
    // mergeUsers(_new, _old) {
    //   let result = {};
    //   Object.keys(_old).forEach(atttr => {
    //     if (_new[atttr]) {
    //       result[atttr] = _new[atttr];
    //     } else {
    //       result[atttr] = _old[atttr];
    //     }
    //   });
    //   // result["userLogo"] = result.userTeam.
    //   return result;
    // },
    // fetchEditedUser(payload) {
    //   return fetch(`${DATA_URL}users/${this.selectedUser.uid}.json`, {
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
    //       this.deselectUsers();
    //       this.$vs.loading();
    //       this.users = await getAllUsers();
    //     })
    //     .catch(error => {
    //       console.error("Error:", error);
    //       this.error = true;
    //       this.errorMsg = error;
    //     });
    // },
    deselectUser() {
      this.selectedUser = "";
    }
    // calcRoundTotalPts() {
    //   this.roundTotal = "...";
    //   const total = roundPointsCalculator(
    //     this.selectedUser.rounds[`r${this.selectedRound}`],
    //     this.selectedRound,
    //     this.players
    //   );
    //   return (this.roundTotal = total);
    // }
  },
  computed: {
    roundTotal() {
      return roundPointsCalculator(
        this.selectedUser.rounds[`r${this.selectedRound}`],
        this.selectedRound,
        this.players
      );
    }
  },
  watch: {
    users(nv) {
      if (nv && this.players) {
        this.$vs.loading.close();
      }
    },
    players(nv) {
      if (nv && this.users) {
        this.$vs.loading.close();
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
    this.players = await getAllPlayersDataNormal();
    this.users = await getAllUsers();
    this.currentRound = await getCurrentRound();
  },
  destroyed(){
    console.log('destroyed');
  }
};
</script>

<style scoped lang="scss">
.users-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .con-vs-alert-success {
    background: #46c93a80;
    color: white;
    margin: 15px;
    width: 97%;
  }

  .user-selection {
    width: 50%;
    padding: 20px 0 20px 20px;

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

  .user-details {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px;
    margin: 10px;
    background-color: darkgrey;
    border-radius: 10px;

    h2 {
      font-weight: bold;
      width: 100%;
      margin: 0 0 10px 0;
      padding: 0 0 5px 0;
      text-align: center;
      border-bottom: 1px solid black;
    }

    .rounds {
      padding: 0 0 10px 0;
      border-bottom: 1px solid #3c474d;
      width: 100%;
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

    .players-container {
      width: 100%;

      h3 {
        padding: 10px 0;
        width: 100%;
        text-align: center;
        font-weight: bold;
      }

      .player {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding: 10px 0;

        .pos {
          width: 7%;
          padding: 0 10px;
        }
        .name {
          width: 30%;
          padding: 0 10px;
        }
        .pts {
          padding: 0 10px;
        }
        .cap {
          padding: 5px;
          background-color: #18d823;
          border-radius: 50%;
          margin: 0 0 0 10px;
        }
        .vc {
          padding: 5px;
          margin: 0 0 0 10px;
          background-color: #18d8cb;
          border-radius: 50%;
        }
      }

      .form-container {
        .round-total {
          width: 100%;
          padding: 10px 0 10px 10px;
          background-color: #59a95d;
          border-radius: 5px;
          font-weight: bold;
        }
      }

      form {
        margin: 10px 0 0 0;

        button {
          margin: 10px 0 0 0;
        }
      }
    }

    form {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      label {
        width: 90%;
        margin: 10px 0 0 0;
        padding: 0 0 10px 0;
        border-bottom: 1px solid #3b454b;

        input[type="checkbox"] {
          margin: 10px;
        }
      }

      .buttons {
        margin: 10px 0 0 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
      }
    }
  }
}
</style>