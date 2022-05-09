<template>
  <n-config-provider :theme="theme" abstract inline-theme-disabled>
    <n-loading-bar-provider>
      <Appbar v-model:theme="theme"></Appbar>
      <back-top />
      <n-global-style />
      <router-view />
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "@vue/runtime-core";
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";

const theme: Ref<null | BuiltInGlobalTheme> = ref(null);

export default defineComponent({
  setup() {
    return {
      theme,
    };
  },
});
</script>