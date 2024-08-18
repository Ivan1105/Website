<template>
    <v-container>
        <v-data-table :headers="headers" :items="items" items-per-page="-1" hover>
            <template #top>
                <v-toolbar>
                    <v-toolbar-title>权限列表</v-toolbar-title>
                    <v-spacer />
                    <v-dialog v-model="showModal" width="500" persistent @update:model-value="modalChange">
                        <template #activator="{ props }">
                            <v-btn color="primary" v-bind="props">新增权限</v-btn>
                        </template>
                        <v-form @submit.prevent="submitForm">
                            <v-card>
                                <v-card-title>
                                    sss
                                </v-card-title>
                                <v-card-text>
                                    <v-text-field v-model="formValue.p_code" label="权限代码" />
                                    <v-text-field v-model="formValue.p_name" label="权限名称" />
                                    <v-text-field v-model="formValue.p_value" label="权限值" />
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer />
                                    <v-btn @click="closeModal">取消</v-btn>
                                    <v-btn type="submit">保存</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-form>
                    </v-dialog>
                </v-toolbar>
            </template>

            <template #item.actions>
                <v-btn icon="mdi-pencil" variant="text" size="small" />
            </template>
        </v-data-table>
    </v-container>
</template>

<script lang="ts" setup>
import { Permission, addPermission, listPermissions } from '@/api/system';

const headers = [
    {
        title: '权限代码',
        value: 'p_code'
    },
    {
        title: '权限名称',
        value: 'p_name'
    },
    {
        title: '权限值',
        value: 'p_value'
    },
    {
        title: '操作',
        value: 'actions'
    }
];

// const items = new Array(50).fill(0).map(() => ({
//     code: 'USER',
//     name: '普通用户',
//     value: 1
// }));
const items = ref<Permission[]>([]);
const reloadTable = async function () {
    items.value = await listPermissions();
}
onMounted(reloadTable);
const showModal = ref(false);
const defaultValue = {
    p_code: '',
    p_name: '',
    p_value: ''
};
const formValue = reactive(defaultValue);
const modalChange = function (show: boolean) {
    if (show) {
        Object.assign(formValue, defaultValue);
    }
}
const closeModal = function () {
    showModal.value = false;
}
const submitForm = async function () {
    await addPermission(formValue);
    closeModal();
    reloadTable();
}

</script>@/api/System