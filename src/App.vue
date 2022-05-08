<template>
  <n-config-provider :theme="theme">
    <n-loading-bar-provider>
      <Appbar v-model:theme="theme"></Appbar>
      <back-top />
      <router-view />
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "@vue/runtime-core";
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";
import BackTop from "@/components/BackTop/index.vue";

const theme: Ref<null | BuiltInGlobalTheme> = ref(null);

export default defineComponent({
  components: { BackTop },
  setup() {
    return {
      theme,
    };
  },
});
</script>