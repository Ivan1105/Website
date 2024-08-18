<!-- 图片上传 -->
<template>
    <v-row v-if="type === 'card'" dense>
        <v-fade-transition :disabled="!multiple" group>
            <v-col v-for="(img, index) in files" :key="typeof img === 'string' ? img : img.key" :cols="cols">
                <v-hover v-slot="{ isHovering, props }">
                    <div class="uploaded rounded" v-bind="props">
                        <v-overlay v-if="!disabled" class="actions" :model-value="isHovering || undefined" persistent
                            contained>
                            <v-btn icon="mdiTrashCan" @click="handleRemoveFile(img)" />
                        </v-overlay>
                        <i-spin v-if="(typeof img !== 'string')" :show="img.progress !== 1" :progress="img.progress" />
                        <v-img :src="previews[index]" :aspect-ratio="aspectRatio" cover />
                    </div>
                </v-hover>
            </v-col>
        </v-fade-transition>

        <v-col v-show="!limited" :cols="cols">
            <v-responsive class="rounded" content-class="upload-container rounded" :aspect-ratio="aspectRatio"
                width="100%" v-ripple @click="handleOpenUploader">
                <v-icon icon="mdi-plus" />
                <div v-if="$slots.default">
                    <slot></slot>
                </div>
            </v-responsive>
        </v-col>
    </v-row>
    <template v-else-if="type === 'list'">
        <v-list-item v-for="img in files">
            <v-list-item-title>
                {{ (typeof img === 'string' ? img : img.filename) }}（正在上传）
            </v-list-item-title>
            <v-list-item-subtitle v-if="(typeof img !== 'string')">
                <v-progress-linear :model-value="(img.progress || 0) * 100" color="primary" />
            </v-list-item-subtitle>
        </v-list-item>
    </template>

    <input ref="uploader" class="d-none" type="file" :accept="accept" :multiple="multiple" @change="handleFileChange" />
</template>

<script lang="ts" setup>
import { upload } from '@/api/Files';
import { ref, computed, onBeforeUnmount, watch } from 'vue';
import { OSSUrlType, useOssStore } from '@/store';

const store = useOssStore();
const props = withDefaults(defineProps<{
    path: OSSUrlType;
    modelValue?: string[];
    multiple?: boolean;
    accept?: string;
    disabled?: boolean;
    limit?: number;
    withExt?: boolean;
    type?: 'card' | 'list';
    /** 不立即上传 */
    lazy?: boolean;
    /** 回显预览图 */
    showPreview?: boolean;
    /** 是否加密 */
    encrypt?: boolean;
    sync?: boolean;
}>(), {
    multiple: false,
    accept: '*',
    /** 是否禁用编辑 */
    disabled: false,
    /** 允许多个文件时的上限 */
    limit: 9,
    type: 'card',
    lazy: false,
    showPreview: true,
    encrypt: false,
    sync: false
});
const emits = defineEmits<{
    (event: 'update:model-value', val: string[]): void;
    (event: 'upload', val: {
        filename: string;
        size: number;
        iv?: string;
    }): void;
}>();

defineExpose({
    length: computed(() => files.value.length),
    /** 暴露打开文件上传 */
    open() {
        handleOpenUploader();
    },
    /** 清空 */
    clear() {
        files.value.forEach(file => {
            destroyFile(file);
        });
        files.value = [];
    },
    /** 新增图片 */
    push(file: string) {
        files.value.push(file);
    },
    /** 手动上传 */
    async upload() {
        await handleFileUpload(true);
    }
});

interface MyFile extends File {
    /** 文件名 */
    filename?: string;
    /** 预览地址 */
    preview?: string;
    /** 上传进度 */
    progress?: number;
    /** 唯一标识 */
    key?: string;
    /** 是否带上原本的后缀名 */
    withExt?: boolean;
}

/** 是否到达上限 */
const limited = computed(() => {
    if (!props.multiple && files.value.length > 0) return true;
    return files.value.length >= props.limit;
});
/** 每行显示数量 */
const cols = computed(() => {
    if (props.multiple) return 4;
    return 12;
});
/** 显示纵横比 */
const aspectRatio = computed(() => {
    if (props.multiple) return 1;
    return 3;
});

/** 原生上传 */
const uploader = ref<HTMLInputElement>();
/** 成功上传的文件 */
const files = ref<(MyFile | string)[]>(props.modelValue || []);

/** 上传成功文件的名字列表 */
const filenames = computed(() => {
    return files.value
        .filter(file => {
            if (typeof file === 'string') return true;
            return file.progress === 1;
        })
        .map(file => {
            if (typeof file === 'string') return file;
            return file.filename || file.name;
        });
})
// 监听文件变化
watch(filenames, (value) => {
    emits('update:model-value', value);
});
/** 预览图列表 */
const previews = computed(() => {
    return files.value.map(file => {
        if (typeof file === 'string') return store.getSourceUrl(props.path, file);
        return file.preview;
    });
})

/** 打开文件上传 */
const handleOpenUploader = function () {
    if (!uploader.value || props.disabled) return;
    uploader.value.value = '';
    uploader.value.click();
}
/** 文件更新 */
const handleFileChange = function () {
    const res = uploader.value?.files;
    if (!res || res.length === 0) return;

    // 待上传文件加入列表
    for (const sourceFile of Array.from(res)) {
        const file = sourceFile as MyFile;
        file.progress = 0;
        file.key = Math.random().toString();
        // 数量限制
        if (limited.value) continue;
        files.value.push(file);
    }
    handleFileUpload();
}
/** 是否正在上传 */
const isUploading = ref(false);
/** 上传文件 */
const handleFileUpload = async function (manual = false) {
    if (isUploading.value || (props.lazy && !manual)) return;
    const file = files.value.find(item =>
        typeof item !== 'string' && item.progress !== 1
    ) as MyFile | undefined;
    if (!file) return;

    isUploading.value = true;
    const ext = props.withExt ? file.name.split('.').at(-1) : undefined;
    const { filename, iv } = await upload({
        path: props.path,
        ext,
        file,
        encrypt: props.encrypt,
        sync: props.sync
    }, (progress => {
        file.progress = progress;
        files.value = [...files.value];
    }));
    emits('upload', { filename, size: file.size, iv });
    if (files.value.includes(file)) {
        file.progress = 1;
        file.filename = filename;
        // 设置预览图
        if (props.showPreview) file.preview = window.URL.createObjectURL(file);
    }
    isUploading.value = false;
    files.value = [...files.value];
    await handleFileUpload(true);
}

/** 移除文件 */
const handleRemoveFile = function (file: typeof files.value[0]) {
    const t = files.value.indexOf(file);
    files.value.splice(t, 1);
    destroyFile(file);
}
const destroyFile = async function (file: string | MyFile) {
    if (typeof file === 'string' || !file.preview) return;
    window.URL.revokeObjectURL(file.preview);
}
// 组件销毁前移除所有图片预览
onBeforeUnmount(() => {
    files.value.forEach(file => {
        destroyFile(file);
    });
})
</script>

<style lang="scss" scoped>
.uploaded {
    position: relative;

    .actions {
        display: flex;
        justify-content: center;
        align-items: center;

        &>* {
            cursor: pointer;
        }
    }
}

:deep(.upload-container) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 12px;
    border: dashed 1px rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-primary));
    transition: all 0.3s;
    cursor: pointer;
    box-shadow: none;
    position: relative;

    &:hover {
        border: dashed 1px rgb(var(--v-theme-primary));
        color: rgb(var(--v-theme-primary));
    }

    * {
        pointer-events: none;
    }
}
</style>