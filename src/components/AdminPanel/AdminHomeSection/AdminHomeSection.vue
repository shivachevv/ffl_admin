<template>
  <div class="admin-home-container">
    <SectionHeader title="FFL Admin panel" />
    <div class="shortcuts">
      <router-link
        class="shortcut sha"
        v-for="(shortcut, i) in shortcuts"
        :key="i"
        :to="shortcut.path"
        >{{ shortcut.title }}</router-link
      >
    </div>
  </div>
</template>


<script>
import SectionHeader from "../../common/SectionHeader";

export default {
  name: "AdminHomeSection",
  components: {
    SectionHeader,
  },
  data() {
    return {
      shortcuts: [
        {
          path: "/matching",
          title: "Matching",
        },
        {
          path: "/sync-points",
          title: "Sync Points",
        },
      ],
    };
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
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .shortcuts {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .shortcut {
      display: inline-block;
      margin: 20px;
      padding: 30px;
      background-color: #893f40;
      color: white;
      border-radius: 10px;
      transition: all 0.2s;

      &:hover {
        background-color: darken($color: #893f40, $amount: 10);

      }
    }
  }
}
</style>