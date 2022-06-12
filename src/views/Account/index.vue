<template>
  <div class="account-container full-height">
    <n-layout position="absolute" has-sider>
      <n-layout-sider
        bordered
        collapse-mode="transform"
        :collapsed-width="0"
        show-trigger
      >
        <n-menu :options="sidebar" :value="$route.name"></n-menu>
      </n-layout-sider>
      <n-layout-content :native-scrollbar="false">
        <router-view />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from "@vue/runtime-core";
import { MenuOption } from "naive-ui";
import { RouterLink } from "vue-router";

const sidebar: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        { to: '/account' },
        {
          default: () => "主页",
        }
      ),
    key: "Account",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: { name: "Timeline" },
        },
        { default: () => "动态" }
      ),
    key: "Timeline",
  },
  {
    label: () =>
      h(RouterLink, { to: { name: "Settings" } }, { default: () => "设置" }),
    key: "Settings",
  },
];

export default defineComponent({
  setup() {
    return {
      sidebar,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>