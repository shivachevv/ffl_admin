<template>
  <div class="cup-section-container" v-if="users">
    <h1 class="section-header">Cup Match Points</h1>

    <!-- CREATE NEW CUP GROUP BUTTON and POPUP -->
    <vs-popup
      v-if="
        selectedStatsPlayer &&
        selectedGroup &&
        selectedRoundNum &&
        selectedMatchNum
      "
      class="holamundo"
      :title="`Add stats for ${players[selectedStatsPlayer[1].id].name}`"
      :active.sync="homeStatsPopup"
    >
      <AddPlayerStatsForm
        :players="players"
        :player="selectedStatsPlayer"
        :group="selectedGroup.name"
        :round="selectedRoundNum"
        :match="selectedMatchNum"
        team="team1"
        @updatedCupGroups="cupGroups = $event"
      />
    </vs-popup>
    <vs-popup
      v-if="
        selectedStatsPlayer &&
        selectedGroup &&
        selectedRoundNum &&
        selectedMatchNum
      "
      class="holamundo"
      :title="`Add stats for ${players[selectedStatsPlayer[1].id].name}`"
      :active.sync="awayStatsPopup"
    >
      <AddPlayerStatsForm
        :players="players"
        :player="selectedStatsPlayer"
        :group="selectedGroup.name"
        :round="selectedRoundNum"
        :match="selectedMatchNum"
        team="team2"
        @updatedCupGroups="cupGroups = $event"
      />
    </vs-popup>

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
      >Team Points successfully updated!</vs-alert
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
                : false,
            }"
            >{{ users[match.team1.id].userTeam }} -
            {{ users[match.team2.id].userTeam }}</a
          >
        </div>
      </div>

      <!-- TEAM 1 -->

      <div v-if="selectedMatch && players" class="squad-selection-container">
        <form class="team-squad" @submit.prevent="submitPointsHandler('home')">
          <span>Team of {{ users[selectedMatch.team1.id].userTeam }}</span>
          <div
            v-for="player in Object.entries(selectedMatch.team1.squad)"
            :key="player[0]"
            class="player-points"
          >
            <vs-button
              color="#59A95D"
              button="button"
              type="relief"
              size="small"
              @click.prevent="openPlayerStatsPopup('home', player)"
              >Stats</vs-button
            >
            <span
              >{{ player[0].toUpperCase() }}:
              {{ players[player[1].id].name }}</span
            >
            <input
              type="number"
              :placeholder="`Last synced: ${player[1].pts}`"
              v-model="cupPointsSquadHome[player[0]]"
            />
          </div>

          <vs-button
            class="submit-btn"
            color="#59A95D"
            button="submit"
            type="relief"
            size="large"
            >Submit Points Team 1</vs-button
          >
        </form>

        <!-- TEAM 2 -->

        <form class="team-squad" @submit.prevent="submitPointsHandler('away')">
          <span>Team of {{ users[selectedMatch.team2.id].userTeam }}</span>
          <div
            v-for="player in Object.entries(selectedMatch.team2.squad)"
            :key="player[0]"
            class="player-points"
          >
            <vs-button
              color="#59A95D"
              button="button"
              type="relief"
              size="small"
              @click.prevent="openPlayerStatsPopup('away', player)"
              >Stats</vs-button
            >
            <span
              >{{ player[0].toUpperCase() }}:
              {{ players[player[1].id].name }}</span
            >
            <input
              type="number"
              :placeholder="`Last synced: ${player[1].pts}`"
              v-model="cupPointsSquadAway[player[0]]"
            />
          </div>

          <vs-button
            class="submit-btn"
            color="#59A95D"
            button="submit"
            type="relief"
            size="large"
            >Submit Points Team 2</vs-button
          >
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AddPlayerStatsForm from "./AddPlayerStatsForm";
import { DATA_URL } from "../../../common";
import getAllUsers from "../../../utils/getAllUsers";
import getAllCupGroups from "../../../utils/getAllCupGroups";
import { getAllPlayersDataNormal } from "../../../utils/getAllPlayersData";

export default {
  name: "CupMatchPoints",
  components: {
    AddPlayerStatsForm,
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
      homeStatsPopup: false,
      awayStatsPopup: false,
      selectedRoundNum: undefined,
      selectedMatchNum: undefined,
      selectedMatch: undefined,
      cupSquadHome: {},
      cupSquadAway: {},
      cupPointsSquadHome: {},
      cupPointsSquadAway: {},
      selectedStatsPlayer: undefined,
    };
  },
  methods: {
    test() {
      let result = {};
      for (const id in this.players) {
        const player = this.players[id];
        result[id] = player;
        result[id].points = {};
      }
      console.log(JSON.stringify(result));
    },
    openPlayerStatsPopup(type, player) {
      this.selectedStatsPlayer = undefined;
      this.selectedStatsPlayer = player;
      if (type === "home") {
        return (this.homeStatsPopup = true);
      } else {
        return (this.awayStatsPopup = true);
      }
    },
    submitPointsHandler(type) {
      const points =
        type === "home" ? this.cupPointsSquadHome : this.cupPointsSquadAway;
      const team = type === "home" ? this.cupSquadHome : this.cupSquadAway;
      const merged = this.mergePtsWithTeam(points, team);

      this.$vs.dialog({
        color: "success",
        title: "Confirm Points edit!",
        text: this.showSuccessMsgPts(merged, type),
        accept: () => {
          this.fetchUpdatedPts(merged, type);
        },
      });
    },
    mergePtsWithTeam(points, team) {
      let merged = {};
      for (const pos in team) {
        const player = team[pos];
        if (points[pos]) {
          merged[pos] = player;
          merged[pos].pts = Number(points[pos]);
        } else {
          merged[pos] = player;
        }
      }
      return merged;
    },
    selectMatchHandler(match, i) {
      this.deselectCupSquads();

      // IF THE TEAMS DO NOT HAVE SELECTED SQUADS THE POINTS DIV WILL NOT RENDER
      if (!match.team1.squad || !match.team2.squad) {
        return this.deselectMatch();
      }

      this.selectedMatch = match;
      this.selectedMatchNum = i + 1;
      if (match.team1.squad) {
        this.cupSquadHome = match.team1.squad;
      }
      if (match.team2.squad) {
        this.cupSquadAway = match.team2.squad;
      }
    },
    fetchUpdatedPts(payload, teamNumber) {
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )
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
    showSuccessMsgPts(team, teamNumber) {
      const teamName =
        teamNumber === "home"
          ? this.users[this.selectedMatch.team1.id].userTeam
          : this.users[this.selectedMatch.team2.id].userTeam;
      return `You are about to edit the squad for ${teamName} team! 
      Players:
      ${Object.entries(team)
        .map((player) => {
          const pos = player[0];
          const name = this.players[player[1].id].name;
          const pts = player[1].pts;
          return `${pos}: ${name} - ${pts} pts`;
        })
        .join(", ")}`;
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
      const result = Object.values(rnd).filter((x) => {
        return typeof x !== "string";
      });
      return result;
    },
    deselectCupSquads() {
      this.cupSquadHome = {};
      this.cupSquadAway = {};
      this.cupPointsSquadHome = {};
      this.cupPointsSquadAway = {};
      return;
    },
    deselectMatch() {
      return (this.selectedMatch = undefined);
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
    },
  },
  async created() {
    this.$vs.loading();
    this.cupGroups = await getAllCupGroups();
    this.users = await getAllUsers();
    this.players = await getAllPlayersDataNormal();
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

        & > span {
          font-weight: bold;
          width: 100%;
          padding: 0 0 10px 0;
          margin: 0 0 10px 0;
          text-align: center;
          border-bottom: 1px solid black;
        }

        .player-points {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          /* padding: 5px 0; */
          margin: 5px 0;

          input {
            width: 40%;
            height: 30px;
            font-weight: bold;
            padding: 5px;
          }
        }

        .submit-btn {
          margin: 15px 0 0 0;
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