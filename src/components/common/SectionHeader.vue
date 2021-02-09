<template>
  <h1 class="section-header">{{ title }}</h1>
</template>

<script>
export default {
  name: "SectionHeader",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.section-header {
  /*margin: 20px 0 0 0; */
    font-size: 1.3rem;
    text-decoration: underline;
    width: 100%;
    text-align: center;
    padding: 10px 0 10px 0;
    background-color: #b1b1b1;
}
</style>
