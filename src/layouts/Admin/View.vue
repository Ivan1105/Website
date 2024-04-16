<template>
    <v-navigation-drawer>
        <v-list-item title="后台管理" />
        <v-divider />
        <v-list-item title="仪表盘" to="/" />
        <v-list-item title="权限管理" to="/admin/permission" />
        <v-list-item title="菜单管理" to="/" />
    </v-navigation-drawer>

    <v-main>
        <router-view />
    </v-main>
</template>

<script lang="ts" setup>
//
</script>