<template>
  <div class="cup-section-container" v-if="users">
    <h1 class="section-header">Cup Squad Selection</h1>

    <!-- CREATE NEW CUP GROUP BUTTON and POPUP -->
    <!-- <vs-popup class="holamundo" title="Create new group!" :active.sync="showPopup1">
      <AddCupGroupForm :users="users" @updatedCupGroups="cupGroups = $event" />
    </vs-popup>-->
    <!-- <vs-button
      class="add-league"
      color="#59A95D"
      button="button"
      type="relief"
      size="large"
      @click.prevent="openAddCupGroupPopup"
    >Create New Cup Group</vs-button>-->

    <vs-button
      color="#59A95D"
      button="submit"
      type="relief"
      size="normal"
      @click.prevent="test"
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
          selected: selectedGroup ? group === selectedGroup.name : false
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
      >Team Squad successfully updated!</vs-alert
    >
    <vs-alert :active.sync="error" closable close-icon="close">{{
      errorMsg
    }}</vs-alert>

    <!-- EDIT FORM -->
    <!-- <form
      @submit.prevent="editCupGroupFormHandler"
      class="cup-group-details-edit"
      v-if="selectedGroup"
    >
      <vs-input label-placeholder="Group name" v-model="selectedGroup.name" color="dark" />
      <vs-select label="Add Team to group" v-model="selectedUser" icon placeholder="Select team">
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
        >{{users[user].userTeam}}</div>
      </div>

      <vs-button color="#59A95D" button="submit" type="relief" size="large">Edit Cup Group</vs-button>
    </form>-->

    <!-- CUP GROUP ROUNDS -->
    <div v-if="selectedGroup" class="groups-rounds-container">
      <div>
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

        <div v-if="selectedRound" class="matches-container">
          <h2>Round is held during round: {{ selectedRound.roundHeld }}</h2>
          <a
            v-for="(match, i) in roundMatchesArray(selectedRound)"
            :key="i"
            @click.prevent="selectMatchHandler(match, i)"
            :class="{
              selected: selectedMatch
                ? selectedMatch.team1.id === match.team1.id &&
                  selectedMatch.team2.id === match.team2.id
                : false
            }"
            >{{ users[match.team1.id].userTeam }} -
            {{ users[match.team2.id].userTeam }}</a
          >
        </div>
      </div>

      <div v-if="selectedMatch && players" class="squad-selection-container">
        <!-- TEAM ! -->
        <div class="team-squad">
          <span>Team of {{ users[selectedMatch.team1.id].userTeam }}</span>
          <a
            v-for="player in matchSquadArray('home')"
            :key="player[0]"
            @click.prevent="addPlayerToCupSquadHandler(player, 'home')"
            :class="{
              selected: isPlayerInSquad(players[player[1]].id, cupSquadHome)
            }"
            >{{ player[0] }}: {{ players[player[1]].name }}</a
          >
          <vs-button
            color="#59A95D"
            button="submit"
            type="relief"
            size="large"
            @click.prevent="editTeamSquadHandler(cupSquadHome, 'home')"
            >Submit team 1</vs-button
          >
        </div>

        <!-- TEAM 2 -->
        <div class="team-squad">
          <span>Team of {{ users[selectedMatch.team2.id].userTeam }}</span>
          <a
            v-for="player in matchSquadArray('away')"
            :key="player[0]"
            @click.prevent="addPlayerToCupSquadHandler(player, 'away')"
            :class="{
              selected: isPlayerInSquad(players[player[1]].id, cupSquadAway)
            }"
            >{{ player[0] }}: {{ players[player[1]].name }}
          </a>
          <vs-button
            color="#59A95D"
            button="submit"
            type="relief"
            size="large"
            @click.prevent="editTeamSquadHandler(cupSquadAway, 'away')"
            >Submit team 2</vs-button
          >
        </div>
      </div>
      <!-- <vs-popup class="holamundo" title="Create new round!" :active.sync="showPopup2">
        <AddCupRoundForm
          :group="cupGroups[selectedGroup.name]"
          :users="users"
          @updatedCupGroups="cupGroups = $event"
        /> 
      </vs-popup>-->
      <!-- <vs-button
        class="add-league"
        color="#59A95D"
        button="button"
        type="relief"
        size="large"
        @click.prevent="openAddGroupRoundPopup"
      >Create New Cup Round</vs-button>-->

      <!-- <form
        @submit.prevent="editCupRoundFormHandler"
        class="cup-group-details-edit"
        v-if="selectedRound"
      >

        <vs-input
          label="Which play-round will be held during??"
          placeholder="Round number"
          v-model="selectedRound.roundHeld"
          type="number"
      />-->
      <!-- MATCHES -->
      <!-- <div
          v-for="match in Object.keys(selectedRound).length -1"
          :key="match"
          class="match-container"
      >-->
      <!-- TEAM 1 -->
      <!-- <vs-select
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
      </vs-select>-->

      <!-- TEAM 2 -->
      <!-- <vs-select
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
      </div>-->
      <!-- MATCHES END -->
      <!-- <vs-button color="#59A95D" button="submit" type="relief" size="large">Edit Cup Round</vs-button>
      </form>-->
    </div>
  </div>
</template>

<script>
// import AddCupGroupForm from "./AddCupGroupForm";
// import AddCupRoundForm from "./AddCupRoundForm";
// import { getAllPlayersDataNormal } from "../../../utils/getAllPlayersData";
import { DATA_URL } from "../../../common";
// import getAllLeagues from "../../../utils/getAllLeagues";
// import { getCurrentRound } from "../../../utils/getCurrentRound";
import getAllUsers from "../../../utils/getAllUsers";
import getAllCupGroups from "../../../utils/getAllCupGroups";
import { getAllPlayersDataNormal } from "../../../utils/getAllPlayersData";
// import uploadAllPlayers from "../../../utils/uploadAllPlayers";
// import { getAllPlayersDataNormal } from '../../../utils/getAllPlayersData';
// import makeNewLeague from "../../../models/League";
// import makeNewTransfer from "../../../models/Transfer";
// import roundPointsCalculator from "../../../utils/roundPointsCalculator";

export default {
  name: "CupSquadSelect",
  components: {
    // AddCupGroupForm,
    // AddCupRoundForm
  },
  data() {
    return {
      cupGroups: undefined,
      users: undefined,
      players: undefined,
      selectedRound: undefined,
      selectedUser: undefined,
      selectedGroup: undefined,
      success: false,
      error: false,
      errorMsg: "",
      showPopup1: false,
      showPopup2: false,
      selectedRoundNum: undefined,
      selectedMatchNum: undefined,
      selectedMatch: undefined,
      cupSquadHome: {},
      cupSquadAway: {}
    };
  },
  methods: {
    isPlayerInSquad(player, squad) {
      if (this.cupSquadHome && this.cupSquadAway) {
        let result = Object.values(squad)
          .map(x => {
            return x.id;
          })
          .includes(player);
        return result;
      } else return false;
    },
    editTeamSquadHandler(team, teamNumber) {
      if (this.isEditedTeamSquadOK(team)) {
        this.$vs.dialog({
          color: "success",
          title: `Confirm ${teamNumber} Squad Edit`,
          text: this.showSuccessMsgSquad(team, teamNumber),
          accept: () => {
            this.fetchUpdatedSquad(team, teamNumber);
          }
        });
      } else {
        this.error = true;
        this.errorMsg = "Please select all positions!";
      }
    },
    addPlayerToCupSquadHandler(player, teamNumber) {
      const pos =
        player[0].length === 3 ? player[0].substring(0, 2) : player[0];
      const id = player[1];
      const stats = {
        assists: 0,
        cleanSheet: 0,
        clearanceOffLine: 0,
        errorLeadToGoal: 0,
        goals: 0,
        lastManTackle: 0,
        manOfTheMatch: 0,
        ownGoals: 0,
        penaltyGoals: 0,
        penaltyMissed: 0,
        penaltySaved: 0,
        ratingOver85: 0,
        redCards: 0,
        saves: 0,
        shotsOnPost: 0,
        starter: 0,
        sub: 0,
        teamVictory: 0,
        threeAllowed: 0,
        yellowCards: 0
      };
      const playerObject = {
        id,
        pts: 0,
        stats
      };
      if (teamNumber === "home") {
        this.$set(this.cupSquadHome, pos, playerObject);
      } else {
        this.$set(this.cupSquadAway, pos, playerObject);
      }
    },
    selectMatchHandler(match, i) {
      this.deselectCupSquads()
      this.selectedMatch = match;
      this.selectedMatchNum = i + 1;
      if (match.team1.squad) {
        this.cupSquadHome = match.team1.squad;
      }
      if (match.team2.squad) {
        this.cupSquadAway = match.team2.squad;
      }
    },
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
            this.fetchUpdatedLeague(this.selectedGroup);
          }
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
          }
        });
      } else {
        this.error = true;
        this.errorMsg = "Please enter round matches correctly!";
      }
    },
    fetchUpdatedLeague(payload) {
      return fetch(`${DATA_URL}cup/${payload.name}.json`, {
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
          this.$vs.loading();
          this.cupGroups = await getAllCupGroups();
        })
        .catch(error => {
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(async data => {
          console.log("Success:", data);
          this.success = true;
          this.$vs.loading();
          this.cupGroups = await getAllCupGroups();
        })
        .catch(error => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    fetchUpdatedSquad(payload, teamNumber) {
      const group = this.selectedGroup.name;
      const rnd = this.selectedRoundNum;
      const match = this.selectedMatchNum;
      const team = teamNumber === "home" ? "team1" : "team2";
      return fetch(
        `${DATA_URL}cup/${group}/rounds/${rnd}/match${match}/${team}/squad.json`,
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
          this.$vs.loading();
          this.cupGroups = await getAllCupGroups();
        })
        .catch(error => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    showSuccessMsg({ name, teams }) {
      return `You are about to edit group ${name}! 
      Users:
      ${Object.values(teams)
        .map(team => {
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
    showSuccessMsgSquad(team, teamNumber) {
      return `You are about to edit the squad for ${teamNumber} team! 
      Players:
      ${Object.entries(team)
        .map(player => {
          const pos = player[0];
          const name = this.players[player[1].id].name;
          return `${pos}: ${name}`;
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
      Object.keys(selectedRound).forEach(matchId => {
        if (matchId !== "roundHeld") {
          const match = selectedRound[matchId];
          if (match.team1.id === "" || match.team2.id === "") {
            flag = false;
          }
        }
      });
      return flag;
    },
    isEditedTeamSquadOK(team) {
      if (Object.keys(team).length === 8) {
        return true;
      }
      return false;
    },
    removeUserFromGroup(u) {
      return (this.selectedGroup.teams = this.selectedGroup.teams.filter(x => {
        return x !== u;
      }));
    },
    selectGroupHandler(r) {
      this.selectedMatch = undefined;
      this.selectedMatchNum = undefined;
      this.selectedRound = undefined;
      this.selectedRoundNum = undefined;
      this.deselectCupSquads();
      this.selectedGroup = this.cupGroups[r];
    },
    selectRoundHandler(r) {
      this.selectedMatch = undefined;
      this.selectedMatchNum = undefined;
      this.deselectCupSquads();
      this.selectedRound = this.selectedGroup.rounds[r];
      this.selectedRoundNum = r;
    },
    roundMatchesArray(rnd) {
      const result = Object.values(rnd).filter(x => {
        return typeof x !== "string";
      });
      return result;
    },
    matchSquadArray(type) {
      const teamNumber = type === "home" ? 1 : 2;
      const result = Object.entries(
        this.users[this.selectedMatch[`team${teamNumber}`].id].rounds[
          `r${this.selectedRound.roundHeld}`
        ].team
      );
      return result;
    },
    deselectCupSquads() {
      this.cupSquadHome = {};
      this.cupSquadAway = {};
      return;
    }
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
  computed: {},
  watch: {
    cupGroups(nv) {
      if (nv && this.users && this.players) {
        this.$vs.loading.close();
        this.selectedGroup = this.cupGroups[this.selectedGroup.name];
      }
    },
    players(nv) {
      if (nv && this.users && this.cupGroups) {
        this.$vs.loading.close();
      }
    },
    users(nv) {
      if (nv && this.players && this.cupGroups) {
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
    }
  },
  async created() {
    this.$vs.loading();
    this.cupGroups = await getAllCupGroups();
    this.users = await getAllUsers();
    this.players = await getAllPlayersDataNormal();
  }
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
      margin: 20px 0 0 0;
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
        border-radius: 5px;
      }
      &.unavailable {
        background-color: #9d9d9d;
        cursor: not-allowed;
      }
    }
  }

  .groups-rounds-container {
    width: 97%;
    margin: 20px 0 0 0;
    background-color: darkgrey;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;

    .matches-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      h2 {
        margin: 10px 0 10px 0;
      }

      a {
        padding: 5px;
        display: inline-block;
        transition: all 0.3s;
        margin: 5px 0 0 0;
        border-radius: 5px;

        &:hover {
          background-color: #59a95d;
          cursor: pointer;
        }
        &.selected {
          background-color: #356538;
          color: white;
          border-radius: 5px;
        }
      }
    }

    .squad-selection-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      width: 60%;

      .team-squad {
        width: 50%;
        margin: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        span {
          font-weight: bold;
          width: 100%;
          padding: 0 0 10px 0;
          margin: 0 0 10px 0;
          text-align: center;
          border-bottom: 1px solid black;
        }

        a {
          margin: 3px 0 3px 0;
          padding: 4px;
          width: 100%;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background-color: #59a95d;
          }
          &.selected {
            background-color: #356538;
            color: white;
            border-radius: 5px;
          }
        }
      }
    }
  }

  .con-vs-alert-success {
    background: #46c93a80;
    color: white;
    margin: 15px;
    width: 97%;
  }
  .con-vs-alert-primary {
    background: #ff4c4c80;
    color: white;
    margin: 15px;
    width: 97%;
    .vs-alert--close {
      background-color: red;
    }
  }
}
</style>