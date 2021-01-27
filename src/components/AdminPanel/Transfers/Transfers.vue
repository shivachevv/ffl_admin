<template>
  <div class="transfers-section-container">
    <h1 class="section-header">Transfers Section</h1>
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
    <vs-alert
      v-if="success"
      title="Update finished!"
      active="true"
      color="success"
      >Transfer successfully updated!</vs-alert
    >
    <vs-alert :active.sync="error" closable close-icon="close">{{
      errorMsg
    }}</vs-alert>
    
    <div v-if="selectedRoundTransfers" class="transfers-container">
      <div
        v-for="userTransfers in sortedRoundTransfers"
        :key="userTransfers[0]"
        class="user-transfers"
      >
        <div class="user-trans-heading">{{ users[userTransfers[0]].userTeam }}</div>
        <div
          v-for="(transfer, i) in sortUserTransfers(
            userTransfers[1]
          )"
          :key="i"
          class="user-transfer"
        >
          <span class="position">{{ transfer[1].position }}</span>
          <span class="in">{{ players[transfer[1].transferIn].name }}</span>
          <span class="out">{{ players[transfer[1].transferOut].name }}</span>
          <span class="status">{{ transfer[1].status }}</span>
          <span class="time" v-if="transfer[1].timeMade.includes(`T`)">
            {{
              transfer[1].timeMade
                .split("T")
                .join(" ")
                .split(".")
                .shift()
            }}
          </span>
          <span class="time" v-else>
            {{
              transfer[1].timeMade}}
          </span>
          <vs-button
            v-if="transfer[1].status === 'pending'"
            color="#59A95D"
            button="button"
            type="relief"
            size="small"
            @click="confirmTransfer(transfer)"
            >Confirm</vs-button
          >
          <vs-button
            v-if="transfer[1].status === 'pending'"
            color="#893f40"
            button="button"
            type="relief"
            size="small"
            @click="cancelTransfer(transfer)"
            >Cancel</vs-button
          >
        </div>
      </div>
    </div>
    <div v-else class="no-transfers">
      <h2>No transfers for round {{ selectedRound }}</h2>
    </div>
    <vs-button
      color="#59A95D"
      button="submit"
      type="relief"
      size="normal"
      @click.prevent="fillTransfers"
      >TEST</vs-button
    >
  </div>
</template>

<script>
// import { getAllPlayersDataNormal } from "../../../utils/getAllPlayersData";
import { DATA_URL } from "../../../common";
import getAllUsers from "../../../utils/getAllUsers";
import { getCurrentRound } from "../../../utils/getCurrentRound";
import getAllTransfers from "../../../utils/getAllTransfers";
import makeNewTransfer from "../../../models/Transfer";
import { getAllPlayersDataNormal } from "../../../utils/getAllPlayersData";
import { setLastUpdateDB } from '../../../utils/setLastUpdate';
import updateLightPlayers from '../../../utils/updateLightPlayers';
// import roundPointsCalculator from "../../../utils/roundPointsCalculator";

export default {
  name: "Transfers",
  components: {},
  data() {
    return {
      users: undefined,
      currentRound: undefined,
      transfers: undefined,
      selectedRoundTransfers: undefined,
      players: undefined,
      //   selectedUser: undefined,
      selectedRound: undefined,
      //   selectedUserTeam: undefined,
      //   userEdited: {},
      success: false,
      error: false,
      errorMsg: ""
      //   newCpt: "",
      //   newViceCpt: "",
      //   roundTotal: 0
    };
  },
  methods: {
    fillTransfers() {
      const newTransfer = makeNewTransfer(
        4,
        "smAQwrSzWYPsoBVXhL1yWUmU1CE3",
        "DC",
        "c6969c32-f562-4fc5-8550-59e43be4a6af",
        "c6752392-58b2-4855-ae56-613e90da8b85"
      );
      this.fetchNewTransfer(newTransfer);
    },
    fetchNewTransfer(payload) {
      return fetch(
        `${DATA_URL}transfers/r${payload.round}/${payload.team}/t2.json`,
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
          //   this.success = true;
          this.$vs.loading();
          this.transfers = await getAllTransfers();
        })
        .catch(error => {
          console.error("Error:", error);
          //   this.error = true;
          //   this.errorMsg = error;
        });
    },
    selectRoundHandler(r) {
      this.selectedRound = r;
      if (this.transfers) {
        this.selectedRoundTransfers = this.transfers[`r${r}`];
        console.log(this.selectedRoundTransfers);
      }
    },
    async confirmTransfer(tr) {
      console.log(tr);
      try {
        await this.updateTransferStatus(tr, "confirmed");
        const team = this.editTeamForNextRnd(tr);
        const count = this.updateTransferCounts(tr, "confirmed");
        const userLeague = this.users[tr[1].team].league;

        await this.uploadUserTransfersCount(count, tr);
        await this.uploadUserUpdatedTeam(team, tr);
        await this.updatePlayerAvailableStatus(
          tr[1].transferIn,
          tr[1].transferOut,
          "confirmed",
          userLeague
        );

        this.success = true;
        this.$vs.loading();
        this.transfers = await getAllTransfers();
        this.users = await getAllUsers();
        this.selectRoundHandler(this.selectedRound);
      } catch (error) {
        console.error(error);
        this.error = true;
        this.errorMsg = error;
      }
    },
    async cancelTransfer(tr) {
      try {
        const count = this.updateTransferCounts(tr, "cancelled");
        const userLeague = this.users[tr[1].team].league;

        await this.updateTransferStatus(tr, "cancelled");
        await this.uploadUserTransfersCount(count, tr);
        await this.updatePlayerAvailableStatus(
          tr[1].transferIn,
          tr[1].transferOut,
          "cancelled",
          userLeague
        );

        this.success = true;
        this.$vs.loading();
        this.transfers = await getAllTransfers();
        this.users = await getAllUsers();
        this.selectRoundHandler(this.selectedRound);
      } catch (error) {
        console.error(error);
        this.error = true;
        this.errorMsg = error;
      }
    },
    uploadUserTransfersCount(count, tr) {
      const payload = {
        transfersMade: count
      };
      return fetch(
        `${DATA_URL}users/${tr[1].team}/rounds/r${this.selectedRound}.json`,
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
          // this.success = true;
          // this.deselectUser();
          // this.$vs.loading();
          // this.users = await getAllUsers();
        })
        .catch(error => {
          console.error("Error:", error);
          // this.error = true;
          // this.errorMsg = error;
        });
    },
    async uploadUserUpdatedTeam(team, tr) {
      const payload = {
        team
      };
      return await fetch(
        `${DATA_URL}users/${tr[1].team}/rounds/r${this.selectedRound}/nextRndInfo.json`,
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
          console.log("SuccessTeam:", data);
          // this.success = true;
          // this.deselectUser();
          // this.$vs.loading();
          // this.users = await getAllUsers();
        })
        .catch(error => {
          console.error("Error:", error);
          // this.error = true;
          // this.errorMsg = error;
        });
    },
    updateTransferCounts(tr, action) {
      const [, transfer] = tr;
      const number = action === "confirmed" ? 0 : -1;
      return (
        this.users[transfer.team].rounds[`r${this.selectedRound}`]
          .transfersMade + number
      );
    },
    editTeamForNextRnd(tr) {
      const [, transfer] = tr;
      const userTeam = this.users[transfer.team].rounds[
        `r${this.selectedRound}`
      ].team;
      const userTeamForNext = this.users[transfer.team].rounds[
        `r${this.selectedRound}`
      ].nextRndInfo.team;
      const editTeam = userTeamForNext ? userTeamForNext : userTeam;
      const _in = transfer.transferIn;
      const _out = transfer.transferOut;

      let result = {};
      Object.keys(editTeam).forEach(pos => {
        if (editTeam[pos] === _out) {
          result[pos] = _in;
        } else {
          result[pos] = editTeam[pos];
        }
        // return x === _out ? _in : x;
      });
      return result;
    },
    updateTransferStatus(tr, status) {
      const payload = { status };
      return fetch(
        `${DATA_URL}transfers/r${this.selectedRound}/${tr[1].team}/${tr[0]}.json`,
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
          // this.success = true;
          // this.$vs.loading();
          // this.transfers = await getAllTransfers();
          // this.selectRoundHandler(this.selectedRound);
        })
        .catch(error => {
          console.error("Error:", error);
          // this.error = true;
          // this.errorMsg = error;
        });
    },
    updatePlayerAvailableStatus(idIn, idOut, action, userLeague) {
      const statusIn = action === "confirmed" ? false : true;
      const statusOut = action === "confirmed" ? true : false;
      const payloadIn = {
        [userLeague]: statusIn
      };
      const payloadOut = {
        [userLeague]: statusOut
      };
      this.fetchNewPlayerAvailableStatus(idIn, payloadIn);
      this.fetchNewPlayerAvailableStatus(idOut, payloadOut);
    },
    fetchNewPlayerAvailableStatus(playerId, payload) {
      console.log(playerId, payload);
      return fetch(`${DATA_URL}players/${playerId}/available/.json`, {
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
          setLastUpdateDB()
          updateLightPlayers()
        })
        .catch(error => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    sortUserTransfers(transfers){
      return Object.entries(transfers).sort((a,b)=>{
        return new Date(b[1].timeMade) - new Date(a[1].timeMade);
      })
    }
    // changeCaptainsHandler() {
    //   const oldCpt = this.selectedUser.rounds[`r${this.selectedRound}`].cpt;
    //   const oldViceCpt = this.selectedUser.rounds[`r${this.selectedRound}`]
    //     .viceCpt;
    //   const updatedCpt = this.newCpt ? this.newCpt : oldCpt;
    //   const updatedVCpt = this.newViceCpt ? this.newViceCpt : oldViceCpt;

    //   if (updatedCpt === updatedVCpt) {
    //     return this.$vs.dialog({
    //       color: "danger",
    //       title: "Please change Captain and ViceCaptain!",
    //       text: "Captain and ViceCaptain should not be the same!"
    //     });
    //   } else {
    //     return this.$vs.dialog({
    //       color: "success",
    //       title: "Confirm Edit",
    //       text: this.showSuccessMsg(updatedCpt, updatedVCpt),
    //       accept: () => this.fetchEditedCaptains(updatedCpt, updatedVCpt)
    //     });
    //   }
    // },
    // fetchEditedCaptains(newC, newVC) {
    //   const { uid } = this.selectedUser;
    //   const payload = {
    //     cpt: newC,
    //     viceCpt: newVC
    //   };
    //   return fetch(
    //     `${DATA_URL}users/${uid}/rounds/r${this.selectedRound}.json`,
    //     {
    //       method: "PATCH",
    //       mode: "cors",
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       body: JSON.stringify(payload)
    //     }
    //   )
    //     .then(response => response.json())
    //     .then(async data => {
    //       console.log("Success:", data);
    //       this.success = true;
    //       this.deselectUser();
    //       this.$vs.loading();
    //       this.users = await getAllUsers();
    //     })
    //     .catch(error => {
    //       console.error("Error:", error);
    //       this.error = true;
    //       this.errorMsg = error;
    //     });
    // },
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
    // showSuccessMsg(C, VC) {
    //   return `Are you sure you want to change
    //           Captain to: ${this.players[C].name}
    //           and Vice Captain to ${this.players[VC].name}?`;
    // },
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
    // deselectUser() {
    //   this.selectedUser = "";
    // }
    // async calcRoundTotalPts() {
    //   this.roundTotal = "...";
    //   const total = await roundPointsCalculator(
    //     this.selectedUser.rounds[`r${this.selectedRound}`],
    //     this.selectedRound
    //   );
    //   return (this.roundTotal = total);
    // }
  },
  computed: {
    sortedRoundTransfers() {
      if (this.selectedRoundTransfers) {
        const result = Object.entries(this.selectedRoundTransfers).sort((a, b) => {
          const user1 = this.users[a[0]];
          const user2 = this.users[b[0]]
          return user1.league.localeCompare(user2.league)
        });
        console.log(result);
        return result
      } else return ''
    }
  },
  watch: {
    players(nv) {
      if (nv && this.users) {
        this.$vs.loading.close();
      }
    },
    users(nv) {
      if (nv && this.players) {
        this.$vs.loading.close();
      }
    },
    transfers(nv) {
      if (nv && this.users && this.players) {
        console.log(nv);
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
    this.transfers = await getAllTransfers();
  }
};
</script>

<style scoped lang="scss">
.transfers-section-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 0 0 20px;

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

  .transfers-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin: 10px 0 0 0;

    .user-transfers {
      width: 98%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      background-color: #96969669;
      border-radius: 10px;
      padding: 10px 0;
      margin: 10px 0 0 0;

      .user-trans-heading {
        width: 98%;
        font-weight: bold;
        padding: 5px 0;
        border-bottom: 1px solid black;
        margin: 0 10px 0 10px;
      }

      .user-transfer {
        padding: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        transition: all 0.3s;

        .in {
          background-color: #669f69b8;
          padding: 10px;
        }
        .out {
          background-color: #893f4091;
          padding: 10px;
        }

        &:hover {
          background-color: darken(#96969669, 10);
        }
      }
    }
  }
  .no-transfers {
    h2 {
      margin: 20px;
      font-weight: bold;
    }
  }

  .con-vs-alert-success {
    background: #46c93a80;
    color: white;
    margin: 15px;
    width: 97%;
  }
}
</style>