import Vue from "vue";
import VueRouter from "vue-router";
const AdminHome = () => import("../components/AdminHome");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "AdminHome",
    component: AdminHome
  },
  // {
  //   path: "/cup",
  //   name: "cup",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../components/AdminPanel/Cup/")
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
