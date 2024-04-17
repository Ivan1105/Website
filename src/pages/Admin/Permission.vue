<template>
    <v-container>
        <v-data-table-virtual :headers="headers" :items="items" sticky>
            <template #top>
                <v-toolbar>
                    <v-toolbar-title>权限列表</v-toolbar-title>
                    <v-spacer />
                    <v-dialog width="500" @update:model-value="dialogChange">
                        <template #activator="{ props }">
                            <v-btn color="primary" v-bind="props">新增权限</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                sss
                            </v-card-title>
                            <v-card-text>
                                <v-form>
                                    <v-text-field label="权限代码" />
                                    <v-text-field label="权限名称" />
                                    <v-text-field label="权限值" />
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn>取消</v-btn>
                                <v-btn>保存</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>

            <template #item.actions>
                <v-btn icon="mdi-pencil" variant="text" size="small" />
            </template>
        </v-data-table-virtual>
    </v-container>
</template>

<script lang="tsx" setup>
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
        title: '权限值',
        value: 'value'
    },
    {
        title: '操作',
        value: 'actions'
    }
];

const items = new Array(50).fill(0).map(() => ({
    code: 'USER',
    name: '普通用户',
    value: 1
}));

const defaultValue = {
    code: '',
    name: '',
    value: ''
};
const formValue = reactive(defaultValue);
const dialogChange = function (show:boolean) {
    console.log(show);
    
    // if(show) Object.assign()
}

</script>