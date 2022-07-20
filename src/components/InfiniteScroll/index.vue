<template>
    <n-el v-if="finished" tag="div" class="container">没有更多了</n-el>
    <n-spin v-else size="small" :show="loading">
        <n-el tag="div" ref="container" class="container" @click="handleClick">加载更多</n-el>
    </n-spin>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, Ref, ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    loading: Boolean,
    finished: Boolean
})
const emits = defineEmits(['update:loading']);
const container: Ref<null | any> = ref(null);

const observer = new IntersectionObserver(entries => {
    if (entries[0].intersectionRatio <= 0) return;
    handleClick();
});

const handleClick = function () {
    if (props.loading === true) return;
    emits('update:loading', true);
}

onMounted(() => {
    if(container.value) observer.observe(container.value.$el);
})

onBeforeUnmount(() => {
    observer.disconnect();
})
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    line-height: 3em;
    text-align: center;
    background-color: var(--tag-color);
    cursor: pointer;
    margin-top: 20px;
}
</style>