<template>
  <n-config-provider
    :locale="locale"
    :date-locale="dateLocale"
    :theme="theme"
    abstract
    inline-theme-disabled
  >
    <n-message-provider placement="top">
      <n-dialog-provider>
        <n-loading-bar-provider>
          <Appbar v-model:theme="theme"></Appbar>
          <back-top />
          <n-global-style />
          <router-view />
        </n-loading-bar-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  provide,
  reactive,
  Ref,
  ref,
} from "@vue/runtime-core";
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";
import { zhCN, dateZhCN, enUS, dateEnUS } from "naive-ui";
import i18n from "./locales";
import { axios } from "./utils";

const theme: Ref<null | BuiltInGlobalTheme> = ref(null);

/** 语言 */
const locale = ref(zhCN);
const dateLocale = ref(dateZhCN);
const setLocale = (event: any) => {
  let lang = "";
  if (typeof event === "object") lang = event.detail.lang;
  else lang = event;

  if (lang === "zh") {
    locale.value = zhCN;
    dateLocale.value = dateZhCN;
  } else if (lang === "en") {
    locale.value = enUS;
    dateLocale.value = dateEnUS;
  }
};
document.addEventListener("languageChange", setLocale);
setLocale(i18n.global.locale);

export default defineComponent({
  setup() {
    /** 用户信息 */
    const userInfo = reactive({
      username: null as null | string,
      icon: null as null | string,
    });
    provide("userInfo", userInfo);
    onMounted(() => {
      axios(
        "/user/getUser",
        {
          method: "get",
        },
        false
      ).then((res) => {
        userInfo.username = res.username;
        userInfo.icon = process.env.VUE_APP_API_URL + res.icon.substring(1);
      });
    });

    return {
      theme,
      locale,
      dateLocale,
    };
  },
});
</script>