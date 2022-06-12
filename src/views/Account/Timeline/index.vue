<template>
  <div class="router-container">
    <Timeline editable></Timeline>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import Timeline from "../components/Timeline/index.vue";

export default defineComponent({
  components: { Timeline },
  setup() {
    return {};
  },
});
</script>


<style lang="scss" scoped>
@import "./index";
</style>