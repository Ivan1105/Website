<!-- 
    首页用的附带大文字说明的背景图
 -->
<template>
    <div ref="container" class="img" :style="coverStyle">
        <i-effects v-if="effect" />
        <h2 v-if="title">
            {{ title }}
        </h2>
    </div>

    <div v-if="subTitle" class="title">
        {{ subTitle }}
    </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
    img: string;
    effect?: boolean;
    title?: string;
    subTitle?: string;
    coverStyle?: Record<string, string>
}>(), {
    effect: false
});

const src = ref('');
const container = ref<HTMLElement>();
const observer = new IntersectionObserver(entries => {
    if (entries[0].intersectionRatio <= 0 || src.value) return;
    src.value = `url(${props.img})`;
});
onMounted(() => {
    observer.observe(container.value!);
})
onBeforeUnmount(() => {
    observer.disconnect();
})
</script>

<style scoped lang="scss">
@import '@/styles/settings';

.img,
.title {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.img {
    background-attachment: fixed;
    background-size: cover;
    background-position: center center;
    height: 100vh;
    user-select: none;
    color: #fff;
    font-size: 2vmax;
    text-shadow: -1px -1px 1px #aaa, 2px 2px 1px #363636;
    overflow: hidden;
    position: relative;
    background-image: v-bind(src);
    transition: filter 0.3s;
}

.title {
    height: 30vh;
    font-size: 1.8vmax;
    position: relative;
    box-shadow: 0px -50px 50px #0005, 0px 50px 50px #0005;

    @media (min-width: $screen-xs) {
        height: 50vh;
    }
}
</style>