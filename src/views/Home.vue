<template>
  <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
  {{ activeKey }}
</template>

<script lang="ts">
import { Component, defineComponent, h, ref } from "@vue/runtime-core";
import { MenuOption, NIcon } from "naive-ui";
import { HomeOutline } from "@vicons/ionicons5";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions: MenuOption[] = [
  {
    label: "主页",
    key: "home",
    icon: renderIcon(HomeOutline),
  },
];

export default defineComponent({
  setup() {
    return {
      activeKey: ref<string | null>(null),
      menuOptions,
    };
  },
});
</script>