import Vue from "vue";
import VueRouter from "vue-router";
// const AdminHome = () => import("../components/AdminHome");
const Rounds = () => import("../components/AdminPanel/Rounds/Rounds");
const PlayersEdit = () => import("../components/AdminPanel/Players/PlayersEdit");
const PlayersPoints = () => import("../components/AdminPanel/Players/PlayersPoints");
const SyncPoints = () => import("../components/AdminPanel/Players/SyncPoints");
const UsersPersonal = () => import("../components/AdminPanel/Users/UsersPersonal");
const UsersTeams = () => import("../components/AdminPanel/Users/UsersTeams");
const Transfers = () => import("../components/AdminPanel/Transfers/Transfers");
const Leagues = () => import("../components/AdminPanel/Leagues/Leagues");
const H2HLeague = () => import("../components/AdminPanel/H2HLeague/H2HLeague");
const CupGroupsAndRounds = () => import("../components/AdminPanel/Cup/CupGroupsAndRounds");
const CupSquadSelect = () => import("../components/AdminPanel/Cup/CupSquadSelect");
const CupMatchPoints = () => import("../components/AdminPanel/Cup/CupMatchPoints");
const Matching = () => import("../components/AdminPanel/Matching/Matching");
const AdminHomeSection = () => import("../components/AdminPanel/AdminHomeSection/AdminHomeSection");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "admin-home",
    component: AdminHomeSection
  },
  {
    path: "/rounds",
    name: "rounds",
    component: Rounds
  },
  {
    path: "/players-edit",
    name: "players-edit",
    component: PlayersEdit
  },
  {
    path: "/players-points",
    name: "players-points",
    component: PlayersPoints
  },
  {
    path: "/sync-points",
    name: "sync-points",
    component: SyncPoints
  },
  {
    path: "/users-personal",
    name: "users-personal",
    component: UsersPersonal
  },
  {
    path: "/users-teams",
    name: "users-teams",
    component: UsersTeams
  },
  {
    path: "/transfers",
    name: "transfers",
    component: Transfers
  },
  {
    path: "/leagues",
    name: "leagues",
    component: Leagues
  },
  {
    path: "/h2h",
    name: "h2h",
    component: H2HLeague
  },
  {
    path: "/cup-groups-rounds",
    name: "cup-groups-rounds",
    component: CupGroupsAndRounds
  },
  {
    path: "/cup-squad-select",
    name: "cup-squad-select",
    component: CupSquadSelect
  },
  {
    path: "/cup-match-points",
    name: "cup-match-points",
    component: CupMatchPoints
  },
  {
    path: "/matching",
    name: "matching",
    component: Matching
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
