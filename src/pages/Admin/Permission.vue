<template>
    <v-container>
        <v-data-table-virtual :headers="headers" :items="items">
            <template #item.actions>
                <v-btn icon="mdi-pencil" variant="text"/>
            </template>
        </v-data-table-virtual>
    </v-container>
</template>

<script lang="ts" setup>
const headers = [
    {
        title: '权限代码',
        value: 'code'
    },
    {
        title: '权限名称',
        value: 'name'
    },
    {
        title: '值',
        value: 'value'
    },
    {
        title: '操作',
        value:'actions'
    }
];

const items = new Array(50).fill(0).map(() => ({
    code: 'USER',
    name: '普通用户',
    value: 1
}));
</script>