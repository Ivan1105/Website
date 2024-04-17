<template>
  <v-app-bar class="border-b-sm" style="position: fixed;" scroll-behavior="elevate">
    <v-app-bar-title>
      <router-link class="title" to="/">
        <v-avatar image="@/assets/favicon.ico" />
        Ivan1105
      </router-link>
    </v-app-bar-title>

    <template v-if="!mdAndUp" #prepend>
      <v-app-bar-nav-icon @click="showSideBar = true" />
    </template>

    <template v-if="mdAndUp" #append>
      <v-btn v-for="item in menus.filter(({ mode }) => mode & 1)" :key="item.title" :to="item.props.to">
        {{ item.title }}
      </v-btn>
      <v-btn v-if="themeName === 'light'" icon="mdi-weather-sunny" @click="changeTheme('dark')" />
      <v-btn v-else icon="mdi-weather-night" @click="changeTheme('light')" />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify';
import { useAppStore, useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
const { mdAndUp } = useDisplay();

const appStore = useAppStore();
const userStore = useUserStore();
const { showSideBar, themeName, menus } = storeToRefs(appStore);
const { changeTheme } = appStore;
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  width: fit-content;
}
</style>