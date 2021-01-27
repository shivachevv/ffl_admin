<template>
  <div id="app">
    <h1>FFL Admin panel</h1>
    <div>
      <router-link to="/" >admin home</router-link>
    </div>
    <transition name="slide-left" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

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

/*------------RESET--------------
---------------------------------*/

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
font,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-weight: inherit;
  font-style: inherit;
  font-size: 100%;
  font-family: "Montserrat", sans-serif;
  vertical-align: baseline;
}

/* remember to define focus styles! */
:focus {
  outline: 0;
}

body {
  line-height: 1;
  color: black;
  background: white;
}

ol,
ul {
  list-style: none;
}

/* tables still need 'cellspacing="0"' in the markup */
table {
  border-collapse: separate;
  border-spacing: 0;
}

caption {
  text-align: left;
  font-weight: normal;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
}

blockquote,
q {
  quotes: "" "";
}

/* * 	{
font-family: 'Source Sans Pro', sans-serif;
} */
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

/*************************************
*****     RESET END   ***************/

.up {
  text-transform: uppercase;
}

.sha {
  -webkit-box-shadow: 5px 5px 21px -5px rgba(0, 0, 0, 0.43);
  -moz-box-shadow: 5px 5px 21px -5px rgba(0, 0, 0, 0.43);
  box-shadow: 5px 5px 21px -5px rgba(0, 0, 0, 0.43);
}

html {
  font-size: 16px;

  // @media #{$mobile} {
  //   font-size: 13px;
  // }
}

/*************** CONTAINER **********/

body {
  width: 100%;
  color: #000000;
  background-color: #c6c6c6;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
</style>
