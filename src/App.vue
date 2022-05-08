<template>
  <n-config-provider :theme="theme">
    <n-loading-bar-provider>
      <appbar v-model:theme="theme"></appbar>
    </n-loading-bar-provider>
  </n-config-provider>
  <!-- <router-view /> -->
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "@vue/runtime-core";
import Appbar from "@/components/Appbar/index.vue";
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";

const theme: Ref<null | BuiltInGlobalTheme> = ref(null);

export default defineComponent({
  components: { Appbar },
  setup() {
    return {
      theme,
    };
  },
});
</script>