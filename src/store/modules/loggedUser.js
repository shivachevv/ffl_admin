// import * as firebase from "firebase/app";
// import "firebase/auth";
// import getAllUsers from '../../utils/getAllUsers'

// const state = {
//     loggedUser: '',
//     menuLinks: [],
// };

// const getters = {
//     menuLinks: state => state.menuLinks,
//     loggedUser: state => state.loggedUser,
// };

// const actions = {
//     fetchLoggedUser({
//         dispatch,
//         commit
//     }, users) {
//         firebase.auth().onAuthStateChanged(async user => {
//             if (user) {
//                 const usersToUse = users ? users : await getAllUsers()
//                 const userObject = usersToUse[user.uid]
//                 commit('setLoggedUser', userObject)
//                 dispatch('fetchMenuLinks')
//             }
//         });
//     },
//     fetchMenuLinks({
//         commit
//     }) {
//         const { loggedUser } = state
//         let tmp = [{
//             title: "Home",
//             path: "/",
//             isMyTeam: false,
//             toShow: true
//         },
//         {
//             title: loggedUser ? "My Team" : "Login",
//             path: loggedUser ? `/team-details/${loggedUser.userLogo}` : "/login",
//             logo: loggedUser ? loggedUser.userLogo : '',
//             isMyTeam: loggedUser ? true : false,
//             toShow: true
//         },
//         {
//             title: "Transfers",
//             path: "/transfers",
//             isMyTeam: false,
//             toShow: true
//         },
//         {
//             title: "Cup",
//             path: "/cup",
//             isMyTeam: false,
//             toShow: true
//         },
//         {
//             title: "H2H",
//             path: "/h2h",
//             isMyTeam: false,
//             toShow: true
//         },
//         // {
//         //     title: "FFL Stats",
//         //     path: "/stats",
//         //     isMyTeam: false,
//         //     toShow: true
//         // },
//         {
//             title: "Rules & Prizes",
//             path: "/rules-prizes",
//             isMyTeam: false,
//             toShow: true
//         },
//         // {
//         //     title: "Stats",
//         //     path: "/stats",
//         //     isMyTeam: false,
//         // },
//         {
//             title: "Admin",
//             path: "/ffl-admin",
//             isMyTeam: false,
//             toShow: loggedUser.uid === 'bPMzc3E7h6OnYOZQCzGJG4otli72' || loggedUser.uid === 'USEqk1zX3bg8saW9biddsDm9P4R2'
//         }
//         ]
//         commit('setMenuLinks', tmp)
//     },
// };

// const mutations = {
//     setLoggedUser: (state, u) => {
//         state.loggedUser = u
//     },
//     setMenuLinks: (state, m) => {
//         state.menuLinks = m
//     },
// };

// export default {
//     state,
//     getters,
//     actions,
//     mutations
// };