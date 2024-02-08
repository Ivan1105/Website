<template>
  <v-app>
    <DefaultSideBar />
    <DefaultBar />
    <DefaultView />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from './default/AppBar.vue'
import DefaultSideBar from './default/SideBar.vue';
import DefaultView from './default/View.vue'
</script>