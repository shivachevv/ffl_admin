<template>
  <div class="cup-section-container" v-if="users">
    <h1 class="section-header">Cup Section</h1>

    <!-- CREATE NEW CUP GROUP BUTTON and POPUP -->
    <vs-popup
      class="holamundo"
      title="Create new group!"
      :active.sync="showPopup1"
    >
      <AddCupGroupForm :users="users" @updatedCupGroups="cupGroups = $event" />
    </vs-popup>
    <vs-button
      class="add-league"
      color="#59A95D"
      button="button"
      type="relief"
      size="large"
      @click.prevent="openAddCupGroupPopup"
      >Create New Cup Group</vs-button
    >

    <vs-button
      color="#59A95D"
      button="submit"
      type="relief"
      size="normal"
      @click.prevent="createH2HRound"
      >TEST</vs-button
    >

    <!-- CUP GROUPS -->
    <div class="rounds" v-if="cupGroups">
      <h2>CUP GROUPS</h2>
      <a
        href
        v-for="group in Object.keys(cupGroups)"
        :key="group"
        @click.prevent="selectGroupHandler(group)"
        :class="{
          selected: selectedGroup ? group === selectedGroup.name : false,
        }"
        >{{ group }}</a
      >
    </div>
    <!-- NOTIFICATIONS -->
    <vs-alert
      v-if="success"
      title="Update finished!"
      active="true"
      color="success"
      >Cup Round successfully updated!</vs-alert
    >
    <vs-alert :active.sync="error" closable close-icon="close">{{
      errorMsg
    }}</vs-alert>

    <!-- EDIT FORM -->
    <form
      @submit.prevent="editCupGroupFormHandler"
      class="cup-group-details-edit"
      v-if="selectedGroup"
    >
      <vs-input
        label-placeholder="Group name"
        v-model="selectedGroup.name"
        color="dark"
      />
      <vs-select
        label="Add Team to group"
        v-model="selectedUser"
        icon
        placeholder="Select team"
      >
        <vs-select-item
          :key="u"
          :value="u"
          :text="users[u].userTeam"
          v-for="u in Object.keys(users)"
        />
      </vs-select>
      <div v-if="selectedGroup.teams.length" class="cup-teams">
        <span>Teams:</span>
        <div
          v-for="user in selectedGroup.teams"
          :key="user"
          @click.prevent="removeUserFromGroup(user)"
        >
          {{ users[user].userTeam }}
        </div>
      </div>

      <vs-button color="#59A95D" button="submit" type="relief" size="large"
        >Edit Cup Group</vs-button
      >
      <vs-button
        color="danger"
        button="button"
        type="relief"
        size="large"
        @click.prevent="deleteHandler('group')"
        >Delete Group</vs-button
      >
    </form>

    <!-- CUP GROUP ROUNDS -->
    <div v-if="selectedGroup" class="groups-rounds-container">
      <vs-popup
        class="holamundo"
        title="Create new round!"
        :active.sync="showPopup2"
      >
        <AddCupRoundForm
          v-if="popupGroup"
          :group="popupGroup"
          :users="users"
          @updatedCupGroups="cupGroups = $event"
        />
      </vs-popup>
        <!-- <AddCupRoundForm
          :group="popupGroup"
          :users="users"
          @updatedCupGroups="cupGroups = $event"
        /> -->
      <vs-button
        class="add-league"
        color="#59A95D"
        button="button"
        type="relief"
        size="large"
        @click.prevent="openAddGroupRoundPopup"
        >Create New Cup Round</vs-button
      >

      <!-- GROUP ROUNDS -->
      <div class="rounds" v-if="selectedGroup.rounds">
        <h2>CUP GROUP ROUNDS</h2>
        <a
          href
          v-for="rnd in Object.keys(selectedGroup.rounds)"
          :key="rnd"
          @click.prevent="selectRoundHandler(rnd)"
          :class="{ selected: rnd === selectedRoundNum }"
          >{{ rnd }}</a
        >
      </div>
      <form
        @submit.prevent="editCupRoundFormHandler"
        class="cup-group-details-edit"
        v-if="selectedRound"
      >
        <vs-input
          label="Which play-round will be held during??"
          placeholder="Round number"
          v-model="selectedRound.roundHeld"
          type="number"
        />
        <!-- MATCHES -->
        <div
          v-for="match in Object.keys(selectedRound).length - 1"
          :key="match"
          class="match-container"
        >
          <!-- TEAM 1 -->
          <vs-select
            :label="`Match ${match}. Team 1`"
            icon
            placeholder="Select team"
            v-model="selectedRound[`match${match}`].team1.id"
          >
            <vs-select-item
              :key="u"
              :value="u"
              :text="users[u].userTeam"
              v-for="u in selectedGroup.teams"
            />
          </vs-select>

          <!-- TEAM 2 -->
          <vs-select
            :label="`Match ${match}. Team 2`"
            icon
            placeholder="Select team"
            v-model="selectedRound[`match${match}`].team2.id"
          >
            <vs-select-item
              :key="u"
              :value="u"
              :text="users[u].userTeam"
              v-for="u in selectedGroup.teams"
            />
          </vs-select>
        </div>
        <!-- MATCHES END -->
        <vs-button color="#59A95D" button="submit" type="relief" size="large"
          >Edit Cup Round</vs-button
        >
        <vs-button
          color="danger"
          button="button"
          type="relief"
          size="large"
          @click.prevent="deleteHandler('round')"
          >Delete Round</vs-button
        >
      </form>
    </div>
  </div>
</template>

<script>
import AddCupGroupForm from "./AddCupGroupForm";
import AddCupRoundForm from "./AddCupRoundForm";
// import { getAllPlayersDataNormal } from "../../../utils/getAllPlayersData";
import { DATA_URL } from "../../../common";
// import getAllLeagues from "../../../utils/getAllLeagues";
// import { getCurrentRound } from "../../../utils/getCurrentRound";
import getAllUsers from "../../../utils/getAllUsers";
import getAllCupGroups from "../../../utils/getAllCupGroups";
// import uploadAllPlayers from "../../../utils/uploadAllPlayers";
// import { getAllPlayersDataNormal } from '../../../utils/getAllPlayersData';
// import makeNewLeague from "../../../models/League";
// import makeNewTransfer from "../../../models/Transfer";
// import roundPointsCalculator from "../../../utils/roundPointsCalculator";

export default {
  name: "CupGroupsAndRounds",
  components: {
    AddCupGroupForm,
    AddCupRoundForm,
  },
  data() {
    return {
      cupGroups: undefined,
      users: undefined,
      selectedRound: undefined,
      selectedUser: undefined,
      selectedGroup: undefined,
      success: false,
      error: false,
      errorMsg: "",
      showPopup1: false,
      showPopup2: false,
      selectedRoundNum: undefined,
    };
  },
  methods: {
    openAddCupGroupPopup() {
      return (this.showPopup1 = true);
    },
    openAddGroupRoundPopup() {
      return (this.showPopup2 = true);
    },
    editCupGroupFormHandler() {
      if (this.isEditedCupGroupOK()) {
        this.$vs.dialog({
          color: "success",
          title: "Confirm Edit",
          text: this.showSuccessMsg(this.selectedGroup),
          accept: () => {
            this.fetchUpdatedGroup(this.selectedGroup);
          },
        });
      } else {
        this.error = true;
        this.errorMsg = "Please enter group name and members!";
      }
    },
    editCupRoundFormHandler() {
      if (this.isEditedCupRoundOK()) {
        this.$vs.dialog({
          color: "success",
          title: "Confirm Edit",
          text: this.showSuccessMsgRnd(this.selectedRound),
          accept: () => {
            this.fetchUpdatedRound(this.selectedRound, this.selectedRoundNum);
          },
        });
      } else {
        this.error = true;
        this.errorMsg = "Please enter round matches correctly!";
      }
    },
    fetchUpdatedGroup(payload) {
      return fetch(`${DATA_URL}cup/${payload.name}.json`, {
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
          this.$vs.loading();
          this.cupGroups = await getAllCupGroups();
        })
        .catch((error) => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    fetchUpdatedRound(payload, rnd) {
      const group = this.selectedGroup.name;
      return fetch(`${DATA_URL}cup/${group}/rounds/${rnd}.json`, {
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
          this.$vs.loading();
          this.cupGroups = await getAllCupGroups();
        })
        .catch((error) => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    showSuccessMsg({ name, teams }) {
      return `You are about to edit group ${name}! 
      Users:
      ${Object.values(teams)
        .map((team) => {
          return `${this.users[team].userTeam}`;
        })
        .join(", ")}`;
    },
    showSuccessMsgRnd(rnd) {
      return `You are about to edit the round! 
      Matches:
      ${Object.values(rnd)
        .map((match, i) => {
          if (typeof match !== "string") {
            const roundLabel = `Match ${i + 1}: `;
            return `${roundLabel} ${this.users[match.team1.id].userTeam} - ${
              this.users[match.team2.id].userTeam
            }`;
          }
        })
        .join(", ")}`;
    },
    isEditedCupGroupOK() {
      if (this.selectedGroup.name && this.selectedGroup.teams.length) {
        return true;
      } else {
        return false;
      }
    },
    isEditedCupRoundOK() {
      const { selectedRound } = this;
      let flag = true;
      Object.keys(selectedRound).forEach((matchId) => {
        if (matchId !== "roundHeld") {
          const match = selectedRound[matchId];
          if (match.team1.id === "" || match.team2.id === "") {
            flag = false;
          }
        }
      });
      return flag;
    },
    removeUserFromGroup(u) {
      return (this.selectedGroup.teams = this.selectedGroup.teams.filter(
        (x) => {
          return x !== u;
        }
      ));
    },
    selectGroupHandler(r) {
      this.selectedRound = undefined;
      this.selectedRoundNum = undefined;
      this.selectedGroup = this.cupGroups[r];
    },
    selectRoundHandler(r) {
      this.selectedRound = this.selectedGroup.rounds[r];
      this.selectedRoundNum = r;
    },
    deleteHandler(type) {
      const text =
        type === "group"
          ? `Are you sure you want to delete group ${this.selectedGroup.name} ?`
          : `Are you sure you want to delete round ${this.selectedRoundNum} ?`;
      this.$vs.dialog({
        color: "success",
        title: "Confirm Delete",
        text: text,
        accept: () => {
          this.fetchDeletedPart(type);
        },
      });
    },
    fetchDeletedPart(type) {
      const url =
        type === "group"
          ? `${DATA_URL}cup/${this.selectedGroup.name}.json`
          : `${DATA_URL}cup/${this.selectedGroup.name}/rounds/${this.selectedRoundNum}.json`;

      return fetch(url, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          console.log("Success:", data);
          this.success = true;
          this.$vs.loading();
          this.selectedRound = undefined;
          this.selectedRoundNum = undefined;
          this.cupGroups = await getAllCupGroups();
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
    //     let user = copy[id];
    //     if (leagueTeams.includes(id)) {
    //       if (user["league"]) {
    //         user["league"] = leagueId;
    //       } else {
    //         user["league"] = {};
    //         user["league"] = leagueId;
    //       }
    //     } else if (user["league"] && user["league"] === leagueId) {
    //       user["league"] = {};
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
    // fillTransfers() {
    //   const newTransfer = makeNewTransfer(
    //     14,
    //     "smAQwrSzWYPsoBVXhL1yWUmU1CE3",
    //     "DC",
    //     "8b6c6764-b08d-41f0-bad2-dc91dc0bef01",
    //     "c259f27d-835f-4cd7-8f8f-ad114cfa6fb5"
    //   );
    //   this.fetchNewTransfer(newTransfer);
    // },
    // fetchNewTransfer(payload) {
    //   return fetch(
    //     `${DATA_URL}transfers/r${payload.round}/${payload.team}/t1.json`,
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
    //       //   this.success = true;
    //       this.$vs.loading();
    //       this.transfers = await getAllTransfers();
    //     })
    //     .catch(error => {
    //       console.error("Error:", error);
    //       //   this.error = true;
    //       //   this.errorMsg = error;
    //     });
    // },

    // async confirmTransfer(tr) {
    //   try {
    //     await this.updateTransferStatus(tr, "confirmed");
    //     const team = this.editTeamForNextRnd(tr);
    //     // const count = this.updateTransferCounts(tr,'confirmed');
    //     // const count = this.updateTransferCounts(tr,'confirmed');
    //     // await this.uploadUserTransfersCount(count, tr);
    //     await this.uploadUserUpdatedTeam(team, tr);
    //     this.success = true;
    //     this.$vs.loading();
    //     this.transfers = await getAllTransfers();
    //     this.users = await getAllUsers();
    //     this.selectRoundHandler(this.selectedRound);
    //   } catch (error) {
    //     console.error(error);
    //     this.error = true;
    //     this.errorMsg = error;
    //   }
    // },
    // async cancelTransfer(tr) {
    //   try {
    //     const count = this.updateTransferCounts(tr, "cancelled");
    //     await this.updateTransferStatus(tr, "cancelled");
    //     await this.uploadUserTransfersCount(count, tr);
    //     this.success = true;
    //     this.$vs.loading();
    //     this.transfers = await getAllTransfers();
    //     this.users = await getAllUsers();
    //     this.selectRoundHandler(this.selectedRound);
    //   } catch (error) {
    //     console.error(error);
    //     this.error = true;
    //     this.errorMsg = error;
    //   }
    // },
    // uploadUserTransfersCount(count, tr) {
    //   const payload = {
    //     transfersMade: count
    //   };
    //   return fetch(
    //     `${DATA_URL}users/${tr[1].team}/rounds/r${this.selectedRound}.json`,
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
    //       // this.success = true;
    //       // this.deselectUser();
    //       // this.$vs.loading();
    //       // this.users = await getAllUsers();
    //     })
    //     .catch(error => {
    //       console.error("Error:", error);
    //       // this.error = true;
    //       // this.errorMsg = error;
    //     });
    // },
    // uploadUserUpdatedTeam(team, tr) {
    //   const payload = {
    //     team
    //   };
    //   return fetch(
    //     `${DATA_URL}users/${tr[1].team}/rounds/r${this.selectedRound}/nextRndInfo.json`,
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
    //       // this.success = true;
    //       // this.deselectUser();
    //       // this.$vs.loading();
    //       // this.users = await getAllUsers();
    //     })
    //     .catch(error => {
    //       console.error("Error:", error);
    //       // this.error = true;
    //       // this.errorMsg = error;
    //     });
    // },
    // updateTransferCounts(tr, action) {
    //   const [, transfer] = tr;
    //   const number = action === "confirmed" ? 1 : -1;
    //   return (
    //     this.users[transfer.team].rounds[`r${this.selectedRound}`]
    //       .transfersMade + number
    //   );
    // },
    // editTeamForNextRnd(tr) {
    //   const [, transfer] = tr;
    //   const userTeam = this.users[transfer.team].rounds[
    //     `r${this.selectedRound}`
    //   ].team;
    //   const userTeamForNext = this.users[transfer.team].rounds[
    //     `r${this.selectedRound}`
    //   ].nextRndInfo.team;
    //   const editTeam = userTeamForNext ? userTeamForNext : userTeam;
    //   const _in = transfer.transferIn;
    //   const _out = transfer.transferOut;

    //   return Object.values(editTeam).map(x => {
    //     return x === _out ? _in : x;
    //   });
    // },
    // updateTransferStatus(tr, status) {
    //   const payload = { status };
    //   return fetch(
    //     `${DATA_URL}transfers/r${this.selectedRound}/${tr[1].team}/${tr[0]}.json`,
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
    //       // this.success = true;
    //       // this.$vs.loading();
    //       // this.transfers = await getAllTransfers();
    //       // this.selectRoundHandler(this.selectedRound);
    //     })
    //     .catch(error => {
    //       console.error("Error:", error);
    //       // this.error = true;
    //       // this.errorMsg = error;
    //     });
    // }
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
    popupGroup() {
      if (this.selectedGroup) {
        return this.cupGroups[this.selectedGroup.name];
      } else {
        return undefined;
      }
    },
  },
  watch: {
    cupGroups(nv) {
      if (nv && this.users) {
        this.$vs.loading.close();
        this.selectedGroup = this.cupGroups[this.selectedGroup.name];
      }
    },
    users(nv) {
      if (nv) {
        this.$vs.loading.close();
      }
    },
    selectedUser(nv) {
      if (nv && !this.selectedGroup.teams.includes(nv)) {
        this.selectedGroup.teams.push(nv);
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
    this.cupGroups = await getAllCupGroups();
    this.users = await getAllUsers();
  },
};
</script>

<style scoped lang="scss">
.cup-section-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 0 0 20px;

  .league-selection {
    margin: 20px 0 0 0;
  }
  .cup-group-details-edit {
    width: 50%;
    margin: 20px 0 0 0;
    background-color: darkgrey;
    border-radius: 10px;
    padding: 10px;

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

    button {
      margin: 20px 20px 0 0;
    }
  }

  .rounds {
    padding: 0 0 10px 0;
    border-bottom: 1px solid #3c474d;
    width: 100%;
    margin: 10px 0 0 0;
    h2 {
      font-weight: bold;
      margin: 10px;
    }
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

  .groups-rounds-container {
    width: 75%;
    margin: 20px 0 0 0;
    background-color: darkgrey;
    border-radius: 10px;
    padding: 10px;
  }

  .con-vs-alert-success {
    background: #46c93a80;
    color: white;
    margin: 15px;
    width: 97%;
  }
}
</style>