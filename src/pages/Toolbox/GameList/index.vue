<template>
    <v-container class="game-list">
        <v-data-table-server v-model:items-per-page="pages.pageSize" v-model:page="pages.page" :headers="headers"
            :items="items" :items-length="pages.total" :loading="loading" hover @update:page="queryData"
            @update:items-per-page="queryData">
            <template #top>
                <div class="table_top">
                    <v-text-field max-width="300" density="compact" append-inner-icon="mdi-magnify" variant="solo"
                        label="搜索" hide-details single-line />
                    <v-btn class="ml-auto" variant="flat" @click="showDialog">新增</v-btn>
                </div>
            </template>
            <template #item.release_date="{ item }">
                {{ parseReleaseDate(item) }}
            </template>
            <template #item.actions="{ item }">
                <v-btn icon="mdi-pencil" size="small" variant="text" density="comfortable"
                    @click="showDialog(item)"></v-btn>
                <v-btn icon="mdi-delete" size="small" variant="text" density="comfortable" @click="handleRemoveGame"></v-btn>
            </template>
        </v-data-table-server>

        <v-dialog v-model="dialog" max-width="800" persistent>
            <v-card title="游戏信息">
                <v-card-text>
                    <v-form>
                        <v-row dense>
                            <v-col cols="12">
                                <v-text-field v-model="formInfo.name" label="游戏名称" counter="64" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="formInfo.platforms" label="发售平台" />
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="formInfo.release_year" label="发行年份" counter="4" />
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="formInfo.release_month" label="发行月份" counter="2" />
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="formInfo.release_day" label="发行日期" counter="2" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="formInfo.release_note" label="发行说明" counter="32" />
                            </v-col>
                            <v-col cols="12">
                                <i-uploader path="gamecovers" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="closeDialog">取消</v-btn>
                    <v-btn @click="saveDialog">保存</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts" setup>
import { listGamesByPage, removeGame, updateGameInfo, GameMainList } from '@/api/GameList';

/** 表头 */
const headers = [
    {
        title: '游戏名称',
        value: 'name'
    },
    {
        title: '发售平台',
        value: 'platforms'
    },
    {
        title: '发行日期',
        value: 'release_date'
    },
    {
        title: '操作',
        value: 'actions',
        align: 'center'
    }
] as const;

/** 数据列表 */
const items = ref<GameMainList[]>([]);
/** 分页参数 */
const pages = reactive({
    page: 1,
    pageSize: 10,
    total: 0
});
/** 加载中 */
const loading = ref(false);
/** 获取数据 */
const queryData = async function () {
    loading.value = true;
    const result = await listGamesByPage(pages);
    items.value = result.list;
    pages.total = result.total;
    loading.value = false;
}
onMounted(queryData);

/**
 * 解析游戏发行日期
 */
const parseReleaseDate = function (item: GameMainList) {
    let t = '';
    if (item.release_year) {
        t = `${item.release_year}`;
    }
    if (item.release_month) {
        t += `/${item.release_month}`;
    }
    if (item.release_day) {
        t += `/${item.release_day}`;
    }
    if (item.release_note) {
        t += item.release_note;
    }
    return t;
}

/** 显示对话框 */
const dialog = ref(false);
const formInfo = ref<Partial<GameMainList>>({});
/** 显示对话框 */
const showDialog = function (item?: GameMainList) {
    dialog.value = true;
    formInfo.value = { ...item };
}
/** 关闭对话框 */
const closeDialog = function () {
    dialog.value = false;
}
/** 保存对话框 */
const saveDialog = async function () {
    await updateGameInfo(formInfo.value);
    queryData();
    closeDialog();
}

/** 删除游戏 */
const handleRemoveGame = async function (row: GameMainList) {
    await removeGame(row);
    queryData();
}
</script>

<style lang="scss" scoped>
.table_top {
    display: flex;
    align-items: center;
    padding: 1em;
}
</style>