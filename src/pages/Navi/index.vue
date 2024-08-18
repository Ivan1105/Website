<template>
    <v-container class="navi-container">
        <v-list v-model:selected="activeCategory" density="compact" mandatory nav>
            <v-list-item v-for="item in catogories" :key="item.navi_id" :value="item.navi_id" color="primary" rounded>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>

        <v-divider vertical />

        <v-list density="compact" mandatory nav>
            <v-list-item v-for="item in navList" :key="item.navi_id" :href="item.path" color="primary" rounded
                @click.prevent="naviTo(item.path)">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-container>
</template>

<script lang="ts" setup>
import { listNaviMenus, SysMenuNavi } from '@/api/Conf';

const router = useRouter();

const activeCategory = ref([1]);

// 获取菜单列表
const menuList = ref<SysMenuNavi[]>([]);
onMounted(async () => {
    menuList.value = await listNaviMenus();
});
/** 一级菜单列表 */
const catogories = computed(() => {
    return menuList.value.filter(item => item.level === 1);
});
/** 二级菜单列表 */
const navList = computed(() => {
    return menuList.value.filter(item => item.p_id === activeCategory.value[0]);
});

/**
 * 导航到指定页面
 */
const naviTo = (path: string) => {
    if (path.startsWith('/')) {
        router.push(path);
    } else {
        window.open(path);
    }
};
</script>

<style lang="scss" scoped>
.navi-container {
    display: grid;
    grid-template-columns: 38% 1px auto;
    height: 100%;
}
</style>