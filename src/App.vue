<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="theme"
    abstract
    inline-theme-disabled
  >
    <n-message-provider placement="bottom">
      <n-loading-bar-provider>
        <Appbar v-model:theme="theme"></Appbar>
        <back-top />
        <n-global-style />
        <router-view />
      </n-loading-bar-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "@vue/runtime-core";
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";
import { zhCN, dateZhCN } from "naive-ui";

const theme: Ref<null | BuiltInGlobalTheme> = ref(null);

export default defineComponent({
  setup() {
    return {
      theme,
      zhCN,
      dateZhCN,
    };
  },
});
</script>