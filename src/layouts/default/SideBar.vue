<template>
    <v-navigation-drawer v-model="showSideBar" class="drawer" style="position: fixed;" absolute temporary>
        <v-list-item v-if="userData" :title="userData.nickname">
            <!-- <template #prepend>
                <i-avatar :user="userData" />
            </template> -->

            <!-- <template #subtitle>
                <n-ellipsis line-clamp="2" :tooltip="false">{{ userData.sign }}</n-ellipsis>
            </template> -->
        </v-list-item>

        <v-divider />

        <v-list :items="menus" color="primary" mandatory nav />

        <template #append>
            <v-divider />
            <!-- <i-weather /> -->
            <v-list-item prepend-icon="mdi-weather-partly-cloudy" title="今天是个好天气" subtitle="如果将来接入天气系统"></v-list-item>

            <div class="append">
                <v-divider />
                <h6>主题</h6>
                <v-btn-toggle class="theme-mode" rounded="small" :model-value="userTheme" color="primary" mandatory>
                    <v-btn class="bg-grey-lighten-3" prepend-icon="mdi-weather-sunny" value="light"
                        @click="changeTheme('light')">亮色</v-btn>
                    <v-btn class="bg-grey-lighten-3" prepend-icon="mdi-weather-night" value="dark"
                        @click="changeTheme('dark')">深色</v-btn>
                </v-btn-toggle>
                <v-btn-toggle class="theme-mode" rounded="small" :model-value="userTheme" color="primary" mandatory>
                    <v-btn class="bg-grey-lighten-3" prepend-icon="mdi-desktop-tower-monitor" value="system"
                        @click="changeTheme('system')">
                        跟随系统
                    </v-btn>
                </v-btn-toggle>

                <v-divider />
                <v-btn v-if="!userStore.userData" rounded="small" color="grey-lighten-3" to="/">登录</v-btn>
                <!-- <v-btn v-else rounded="small" block @click="signOut">退出登录</v-btn> -->
            </div>
        </template>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useAppStore, useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { userTheme } from '@/utils/storage';

const appStore = useAppStore();
const userStore = useUserStore();
const { menus, showSideBar } = storeToRefs(appStore);
const { changeTheme } = appStore;
const { userData } = storeToRefs(userStore);
</script>

<style lang="scss" scoped>
.drawer {
    .append {
        padding: 6px 12px;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .theme-mode {
            width: 100%;

            button {
                flex: 1;
            }
        }
    }
}
</style>