<template>
  <div class="account-container full-height">
    <n-layout position="absolute" has-sider>
      <n-layout-sider bordered>
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
.account-container {
  position: relative;

  .links {
    a {
      display: block;
      width: 100%;
      line-height: 42px;
      padding: 0 1em;
      margin-top: 8px;
      box-sizing: border-box;
      transition: all 0.3s;

      &:hover {
        background-color: var(--hover-color);
      }

      &.router-link-active {
        background-color: var(--primary-color-suppl);
      }
    }
  }
}
</style>