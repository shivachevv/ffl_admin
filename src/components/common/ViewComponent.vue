<template>
  <transition name="slide-left" mode="out-in">
        <router-view></router-view>
      </transition>
</template>

<script>
export default {
  name: "ViewComponent",
  props: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
/* TRANSITION CLASSES */

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.2s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}

.con-vs-alert-success {
  background: #46c93a80;
  color: white;
  margin: 15px;
  width: 97%;
}

.con-vs-alert-primary {
  width: 98% !important;
  margin: 10px !important;
  background-color: #e5000059 !important;
  color: white !important;

  .con-vs-alert-primary .con-x {
    background-color: #3b454b !important;
    color: #fff !important;
    .vs-alert--close {
      background-color: red !important;
    }
  }
}
</style>
