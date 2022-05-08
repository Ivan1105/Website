<template>
  <n-el tag="header">
    <div class="logo">
      <a href="/">
        <img src="/favicon.ico" alt="" />
        <span>Ivan1105</span>
      </a>
      <n-dropdown
        trigger="click"
        placement="bottom-end"
        show-arrow
        :options="links"
        @select="handleLinksSelect"
      >
        <n-button text>
          <n-icon>
            <menu-outline></menu-outline>
          </n-icon>
        </n-button>
      </n-dropdown>
    </div>

    <nav class="links">
      <template v-for="link in links" :key="link">
        <router-link v-if="link.type === 'route'" :to="link.key">
          {{ link.label }}
        </router-link>
        <n-button
          v-else-if="link.type === 'button'"
          text
          @click="handleLinksSelect(link.key, link)"
        >
          {{ link.label }}
        </n-button>
        <div v-else-if="link.type === 'divider'" class="divider"></div>
        <n-dropdown
          v-else
          trigger="hover"
          show-arrow
          :options="link.children"
          @select="handleLinksSelect"
        >
          <n-button class="dropdown-menu" text>
            {{ link.label }}
            <n-icon>
              <chevron-down-outline></chevron-down-outline>
            </n-icon>
          </n-button>
        </n-dropdown>
      </template>
    </nav>
  </n-el>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  toRefs,
  computed,
  ComputedRef,
  onMounted,
} from "@vue/runtime-core";
import {
  darkTheme,
  DropdownOption,
  useLoadingBar,
  useThemeVars,
} from "naive-ui";
import { ChevronDownOutline, MenuOutline } from "@vicons/ionicons5";
import { listLanguages, setLanguage } from "@/locales";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

/** 系统支持的语言 */
const languages = listLanguages();

export default defineComponent({
  props: {
    theme: Object,
  },
  emits: ["update:theme"],
  components: {
    ChevronDownOutline,
    MenuOutline,
  },
  setup(props, context) {
    const { theme } = toRefs(props);
    const $router = useRouter();
    const { t } = useI18n();

    /** 导航栏链接 */
    const links: ComputedRef<DropdownOption[]> = computed(() => [
      {
        type: "route",
        label: t("appbar.homepage"),
        key: "/",
      },
      {
        type: "route",
        label: t("appbar.tools"),
        key: "/tools",
      },
      {
        type: "divider",
        key: "d1",
      },
      {
        type: "route",
        label: t("appbar.login"),
        key: "/login",
      },
      {
        type: "button",
        label:
          theme.value === null ? t("appbar.darkTheme") : t("appbar.lightTheme"),
        key: "theme",
      },
      {
        label: t("appbar.language"),
        key: "language",
        children: languages,
      },
    ]);
    /** 导航栏链接监听事件 */
    function handleLinksSelect(key: string, val: DropdownOption) {
      if (val.type === "route") $router.push(key);
      else if (val.type === "language") setLanguage(key);
      else if (val.type === "button") {
        if (key === "theme") changeTheme();
      }
    }

    /** 加载条 */
    const loadingBar = useLoadingBar();
    window.loadingBar = loadingBar;

    /** 主题变量 */
    const themeVars = useThemeVars();
    /** 切换主题 */
    function changeTheme(targetTheme = "") {
      if (targetTheme === "dark") context.emit("update:theme", darkTheme);
      else if (targetTheme === "light") context.emit("update:theme", null);
      else {
        if (theme.value === null) {
          window.sessionStorage.setItem("themeMode", "dark");
          context.emit("update:theme", darkTheme);
        } else {
          window.sessionStorage.setItem("themeMode", "light");
          context.emit("update:theme", null);
        }
      }
      nextTick(() => {
        document.querySelector("body")!.style.backgroundColor =
          themeVars.value.bodyColor;
      });
    }
    /** 自动切换主题 */
    function autoChangeTheme() {
      const targetTheme = window.sessionStorage.getItem("themeMode");
      if (targetTheme) changeTheme(targetTheme);
      else if (window.matchMedia("(prefers-color-scheme:dark)").matches)
        changeTheme("dark");
      else if (window.matchMedia("(prefers-color-scheme:light)").matches)
        changeTheme("light");
    }

    window
      .matchMedia("(prefers-color-scheme:dark)")
      .addEventListener("change", autoChangeTheme);
    onMounted(() => {
      autoChangeTheme();
    });

    return { links, handleLinksSelect };
  },
});
</script>

<style scoped lang="scss">
@import "./index";
</style>