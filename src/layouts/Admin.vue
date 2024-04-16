<template>
  <v-app>
    <DefaultSideBar />
    <DefaultBar />
    <AdminView />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from './default/AppBar.vue'
import DefaultSideBar from './default/SideBar.vue';
import AdminView from './Admin/View.vue';
</script>