<template>
  <n-el tag="header">
    <a href="/" class="logo">
      <img src="/favicon.ico" alt="" />
      <span>Ivan1105</span>
    </a>

    <nav class="links">
      <router-link to="/">首页</router-link>
      <router-link to="/tool">工具</router-link>
    </nav>

    <div class="right">
      <n-button text @click="changeTheme">
        <template v-if="theme === null">深色模式</template>
        <template v-else>浅色模式</template>
      </n-button>
      <n-dropdown trigger="hover" :options="languages" @select="setLanguage">
        <n-button class="dropdown-menu" text>
          {{ $t("appbar.language") }}
          <n-icon>
            <chevron-down-outline></chevron-down-outline>
          </n-icon>
        </n-button>
      </n-dropdown>
    </div>
  </n-el>
</template>

<script lang="ts">
import { defineComponent, nextTick, toRefs } from "@vue/runtime-core";
import { darkTheme, useLoadingBar, useThemeVars } from "naive-ui";
import { ChevronDownOutline } from "@vicons/ionicons5";
import { listLanguages, setLanguage } from "@/locales";

/** 系统支持的语言 */
const languages = listLanguages();

export default defineComponent({
  props: {
    theme: Object,
  },
  emits: ["update:theme"],
  components: {
    ChevronDownOutline,
  },
  setup(props, context) {
    /** 加载条 */
    const loadingBar = useLoadingBar();
    window.loadingBar = loadingBar;

    /** 主题变量 */
    const themeVars = useThemeVars();
    /** 切换主题 */
    function changeTheme() {
      const { theme } = toRefs(props);
      if (theme.value === null) context.emit("update:theme", darkTheme);
      else context.emit("update:theme", null);
      nextTick(() => {
        document.querySelector("body")!.style.backgroundColor =
          themeVars.value.bodyColor;
      });
    }

    return { languages, setLanguage, changeTheme };
  },
});
</script>

<style scoped lang="scss">
@import "./index";
</style>