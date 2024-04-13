<template>
    <div>
        <v-list>
            <v-list-item :title="path"></v-list-item>
            <v-list-item title="../" @click="clickBack"></v-list-item>
            <v-list-item v-for="item in fileList" :title="item.name" @click="clickItem(item)"></v-list-item>
        </v-list>

        <v-overlay v-model="showViewer" content-class="w-100 h-100">
            <v-carousel v-model="activeFile" class="w-100 h-100" hide-delimiters progress>
                <v-carousel-item v-for="item in viewList" :src="item" />
                <v-btn class="close-btn" icon="mdi-close" variant="tonal" @click="closeViewer" />
            </v-carousel>
        </v-overlay>
    </div>
</template>

<script lang="ts" setup>
import axios from '@/utils/axios';

type ListItem = { name: string, type: 'dir' | 'file' };
const pathHis: string[] = [];
const path = ref('/');
const fileList = ref<ListItem[]>([]);

const list = async function (p = '') {
    if (p !== '..') {
        pathHis.push(path.value);
        path.value += (p + '/');
    }
    const { data } = await axios.get('/photos/list' + path.value);
    fileList.value = data;
}
onMounted(() => {
    list('..');
});

const clickBack = function () {
    const t = pathHis.pop() || '/';
    path.value = t;
    list('..');
}

const clickItem = function (item: ListItem) {
    if (item.type === 'dir') {
        list(item.name);
    }
    if (item.type === 'file') {
        showViewer.value = true;
        activeFile.value =import.meta.env.VITE_API_URL + '/photos/view/' +  path.value + item.name;
    }
}


const showViewer = ref(false);
const closeViewer = function () {
    showViewer.value = false;
}
const activeFile = ref('');
const viewList = computed(() => {
    return fileList.value.
        filter(({ type }) => type === 'file')
        .map(({ name }) => import.meta.env.VITE_API_URL + '/photos/view/' + path.value + name);
});
</script>

<style lang="scss" scoped>
.close-btn {
    position: absolute;
    right: 50px;
    top: 50px;
}
</style>