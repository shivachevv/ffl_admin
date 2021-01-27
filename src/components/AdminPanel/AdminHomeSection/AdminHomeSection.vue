<template>
  <div class="admin-home-container">
    <h1>FFL Admin panel</h1>
  </div>
</template>

<script>
export default {
  name: "AdminHomeSection",
  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {},
  watch: {},
  created() {},
  beforeDestroy() {
    // console.log('destroy', this);
    // this.$destroy();
  },
};
</script>

<style lang="scss">
.admin-home-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  h1 {
    width: 50%;
    background-color: #793638;
    color: #f2f6db;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    margin: 30px 0 0 0;
    padding: 10px;
  }
}
</style>