<template>
  <div class="users-container">
    <h1 class="section-header">Edit User Personal Details Section</h1>

    <div class="user-selection">
      <!-- <vs-button
        color="#59A95D"
        button="submit"
        type="relief"
        size="normal"
        @click.prevent="test"
        >TEST</vs-button
      > -->
      <label class="select">
        Users:
        <select v-if="users" v-model="userSelected" icon>
          <option :key="u.uid" :value="u" v-for="u in Object.values(users)">{{
            u.userTeam
          }}</option>
        </select>
      </label>
      <!-- <label>
        Users:
        <vs-select v-if="users" v-model="userSelected" icon>
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
    <div class="user-details" v-if="userSelected">
      <h2>Selected User: {{ userSelected.email }}</h2>
      <form @submit.prevent="editUserFormHandler">
        <label>
          Email:
          <vs-input
            :label-placeholder="userSelected.email"
            v-model="userEdited.email"
            icon
          />
        </label>
        <label>
          User Team Name:
          <vs-input
            :label-placeholder="userSelected.userTeam"
            v-model="userEdited.userTeam"
            icon
          />
        </label>
        <label>
          User Age:
          <vs-input
            type="number"
            :label-placeholder="userSelected.age"
            v-model="userEdited.age"
            icon
          />
        </label>
        <label>
          User Favourite Team:
          <vs-input
            :label-placeholder="userSelected.favTeam"
            v-model="userEdited.favTeam"
            icon
          />
        </label>
        <label>
          User Location:
          <vs-input
            :label-placeholder="userSelected.location"
            v-model="userEdited.location"
            icon
          />
        </label>
        <label>
          User Motto:
          <vs-input
            :label-placeholder="userSelected.motto"
            v-model="userEdited.motto"
            icon
          />
        </label>
        <label>
          User Ocupation:
          <vs-input
            :label-placeholder="userSelected.ocupation"
            v-model="userEdited.ocupation"
            icon
          />
        </label>
        <label>
          User Code:
          <vs-input
            type="number"
            :label-placeholder="userSelected.code"
            v-model="userEdited.code"
            icon
          />
        </label>
        <label>
          <input type="checkbox" v-model="userEdited.isAdmin" />
          User Admin Rights. Currently user is
          {{ userSelected.isAdmin ? "" : "NOT" }} an admin!
        </label>

        <div class="buttons">
          <vs-button color="#59A95D" button="submit" type="relief" size="large"
            >Edit User</vs-button
          >
          <vs-button
            color="danger"
            button="button"
            type="relief"
            size="large"
            @click.prevent="deleteUserHandler(userSelected.uid)"
            >Delete User</vs-button
          >
          <vs-button
            color="#59A95D"
            button="submit"
            type="relief"
            size="normal"
            @click.prevent="test"
            >TEST</vs-button
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { DATA_URL } from "../../../common";
import { makeNewUser } from "../../../models/User";
import getAllUsers from "../../../utils/getAllUsers";

export default {
  name: "UsersPersonal",
  components: {},
  data() {
    return {
      users: undefined,
      userSelected: undefined,
      userEdited: {},
      success: false,
      error: false,
      errorMsg: ""
    };
  },
  methods: {
    // async test() {
    //   // const copy = JSON.parse(JSON.stringify(this.players));
    //   let counter = 0;
    //   for (const id in this.users) {
    //     const user = this.users[id];
    //     const league = user.league;
    //     const team1 = Object.values(user.rounds[`r2`].team);
    //     // const team2 = Object.values(user.rounds[`r2`].nextRndInfo.team)
    //     // console.log(team1);
    //     for (let i = 0; i < team1.length; i++) {
    //       const player = team1[i];
    //       if (player) {
    //         const payload = {
    //           [league]: false
    //         };
    //         console.log(league, player);
    //         // console.log(payload);

    //         await fetch(`${DATA_URL}players/${player}/available/.json`, {
    //           method: "PATCH",
    //           mode: "cors",
    //           headers: {
    //             "Content-Type": "application/json"
    //           },
    //           body: JSON.stringify(payload)
    //         })
    //           .then(response => response.json())
    //           .then(data => {
    //             console.log("Success:", data);
    //           })
    //           .catch(error => {
    //             console.error("Error:", error);
    //           });

    //         // const playerReady = await response.json();
    //         counter++;
    //         console.log(counter);
    //       }
    //     }
    //   }
    // },
    // test() {
    //   const users = {
    //     qM55Gg1xhBbgB5QsWP5FvXEqQrB3: 1,
    //     "7tjzW3pudtWpQd5cqQzBK2uOrLo2": 2,
    //     Wh4kUmCfz6b7MpBAWSlP4v9K6sX2: 3,
    //     bPMzc3E7h6OnYOZQCzGJG4otli72: 4,
    //     vMZTRw7JtYdN22OR7IZ6B410oIm1: 5,
    //     "1UEjAKUq3hU1ZaoXtTLSzkdlqWB3": 6,
    //     k7WxaNO7bdgQipF8I2g3iOyIn0Z2: 7,
    //     nsC36KbkTLeUJOzLidGqage2gL23: 8,
    //     zg8NJkbTohelzFomiLZMmrHwQhJ3: 9,
    //     USEqk1zX3bg8saW9biddsDm9P4R2: 10,
    //     HXGFtVTMwyeYxkW8eVCfXw9EJEY2: 11,
    //     UFD3ccSLkZcfOhS1gEeiGu9COng2: 12,
    //     fwWpwxGuLMUJbHIpcP5ctXdYqXr1: 13,
    //     BXf8jQ6xiDZJlwUj1zoi0m6TDPM2: 14,
    //     VPcWnGqQ6GXFr0w9gfOMX6FHork1: 15,
    //     iRA9PssA87f1njtVMSHYksLQNKM2: 16,
    //     Xa0MdkBqkOM84E2bCBm1egKXZB43: 17,
    //     "6VTr2lfia9auyWY568XGoglpIHQ2": 18,
    //     "6fbtewcbmdYPRngaIpYGSJue3Th2": 19,
    //     rtm22gY184WAKNNwDIxHwFYycwk2: 20,
    //     "4242f8vV7HVbiEWpBffhg5PoB9E3": 21,
    //     EQKc4OEkbESENPKutkY208Sx54j2: 22
    //   };
    //   const arr = Object.keys(this.users);

    //   for (let i = 0; i < arr.length; i++) {
    //     const id = arr[i];
    //     if (Object.keys(users).includes(id)) {
    //       const code = users[id];

    //       const payload = {
    //         code
    //       };

    //       fetch(`${DATA_URL}users/${id}.json`, {
    //         method: "PATCH",
    //         mode: "cors",
    //         headers: {
    //           "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(payload)
    //       })
    //         .then(response => response.json())
    //         .then(async data => {
    //           console.log(data);
    //         })
    //         .catch(error => {
    //           console.error("Error:", error);
    //           this.error = true;
    //           this.errorMsg = error;
    //         });
    //     }
    //   }
    // },
    editUserFormHandler() {
      const merged = this.mergeUsers(this.userEdited, this.userSelected);
      const {
        uid,
        email,
        name,
        userTeam,
        age,
        location,
        ocupation,
        favTeam,
        motto,
        code
      } = merged;
      const newUser = makeNewUser(
        uid,
        email,
        name,
        userTeam,
        age,
        location,
        ocupation,
        favTeam,
        motto,
        code
      );
      console.log(this.userEdited, this.userSelected, newUser);
      return this.$vs.dialog({
        color: "success",
        title: "Confirm Edit",
        text: this.showSuccessMsg(newUser),
        accept: () => this.fetchEditedUser(newUser)
      });
    },
    deleteUserHandler(uid) {
      return this.$vs.dialog({
        color: "danger",
        title: "Confirm Delete",
        text: "ARE YOU SURE YOU WANT TO DELETE THE USER FROM THE DATABASE ???",
        accept: () =>
          fetch(`${DATA_URL}users/${uid}.json`, {
            method: "DELETE"
          })
            .then(async () => {
              this.success = true;
              this.deselectUsers();
              this.$vs.loading();
              this.users = await getAllUsers();
            })
            .catch(error => {
              console.error("Error:", error);
              this.error = true;
              this.errorMsg = error;
            })
      });
    },
    showSuccessMsg(user) {
      return `Edited User:
          age:${user.age}
          email:${user.email}
          favTeam:${user.favTeam}
          isAdmin:${user.isAdmin}
          location:${user.location}
          motto:${user.motto}
          ocupation:${user.ocupation}
          userTeam:${user.userTeam}
          `;
    },
    mergeUsers(_new, _old) {
      let result = {};
      Object.keys(_old).forEach(atttr => {
        if (_new[atttr]) {
          result[atttr] = _new[atttr];
        } else {
          result[atttr] = _old[atttr];
        }
      });
      // result["userLogo"] = result.userTeam.
      return result;
    },
    fetchEditedUser(payload) {
      return fetch(`${DATA_URL}users/${this.userSelected.uid}.json`, {
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
          this.deselectUsers();
          this.$vs.loading();
          this.users = await getAllUsers();
        })
        .catch(error => {
          console.error("Error:", error);
          this.error = true;
          this.errorMsg = error;
        });
    },
    deselectUsers() {
      this.userEdited = {};
      this.userSelected = "";
    }
  },
  computed: {},
  watch: {
    users(nv) {
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
    }
  },
  async created() {
    this.$vs.loading();
    this.users = await getAllUsers();
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
    // label {
    //   font-weight: bold;
    //   display: inline-block;
    //   div {
    //     margin: 10px 0 0 0;
    //   }
    // }
  }

  .user-details {
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