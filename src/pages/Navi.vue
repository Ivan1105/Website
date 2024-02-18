<template>
    <div class="navi-container">
        <div class="child" v-for="item in navis" :key="item.title">
            <img :src="item.background">
        </div>
    </div>
</template>

<script lang="ts" setup>
const navis = ref<any[]>([
    {
        icon: 'mdi-controller',
        title: '游戏进度管理',
        introduction: ['对多个平台的游戏进行统一的进度管理', '需要手动操作'],
        to: '/',
        background: 'https://oss.ivan1105.top/static/tool-game.png'
    },
    {
        icon: 'mdi-home',
        title: '租房记录',
        introduction: ['管理租房过程中的各项金额统计与计算', '记录一些基本信息'],
        to: '/',
        background: 'https://oss.ivan1105.top/static/tool-house.jpg'
    },
    {
        icon: 'mdi-image-multiple',
        title: '图库',
        introduction: ['云端图片存储', '打算更换到nas上', '敬请期待'],
        to: '/',
        background: 'https://oss.ivan1105.top/static/view-3.png'
    },
]);

navis.value = new Array(9).fill({}).map(item => {
    const introduction = new Array(((Math.random() * 3) | 0) + 1).fill('这是一段文本');
    return {
        title: 'TEST',
        introduction,
        background: 'https://oss.ivan1105.top/static/view-3.png'
    }
})
</script>

<style lang="scss" scoped>
.navi-container {
    padding: .8rem;
    background: black;
    width: 100%;
    height: 100%;
    max-width: 600px;
    margin: auto;
    overflow: hidden;
    display: grid;
    position: relative;

    grid-template-columns: 1fr .7fr .3fr 1fr;
    grid-template-rows: 20% 40% 20% 20%;
    grid-template-areas:
        'one two two three'
        'four five five five'
        'six five five five'
        'six seven eight eight';

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 70% 20%;
        transition: 0.3s;
        cursor: pointer;

        &:hover {
            transform: scale(120%);
        }
    }
}


// For clipping I used mozilla's inspect element. 
.child {
    position: absolute;
    inset: 0;

    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
        img {
            width: 120%;
            height: 120%;
        }
    }

    &:first-child {
        grid-area: one;
        clip-path: polygon(0% 0%, 93.24% 0%, 105.04% 110.16%, 0% 90%);
    }

    &:nth-child(2) {
        grid-area: two;
        clip-path: polygon(0% 0%, 108.28% 0%, 96.45% 110.13%, 10.55% 110.93%);
    }

    &:nth-child(3) {
        grid-area: three;
        clip-path: polygon(15.05% 0%, 100% 0%, 99.35% 91.7%, 3.08% 108.48%);
    }

    &:nth-child(4) {
        grid-area: four;
        clip-path: polygon(0% -0.85%, 106.34% 9.98%, 121.32% 65.63%, 99.66% 109.89%, 1.86% 124.41%);

        img {
            width: 135%;
            height: 135%;
        }
    }

    &:nth-child(5) {
        grid-area: five;
        clip-path: polygon(6.4% 6.48%, 47.24% 5.89%, 100% 0%, 98.41% 96.85%, 53.37% 100%, 53% 63.21%, 3.23% 73.02%, 14.30% 44.04%);
    }

    &:nth-child(6) {
        grid-area: six;
        clip-path: polygon(2.14% 29.3%, 99.34% 15.42%, 98.14% 100.82%, 1.57% 101.2%);
    }

    &:nth-child(7) {
        grid-area: seven;
        clip-path: polygon(7.92% 33.47%, 96.31% 23.39%, 95.38% 100%, 5.30% 100.85%);
    }

    &:nth-child(8) {
        grid-area: eight;
        clip-path: polygon(2.5% 22.35%, 100% 0%, 100% 100%, 1.55% 100%);
    }

    &:nth-child(9) {
        grid-row-start: 3;
        grid-row-end: 4;
        grid-column-start: 2;
        grid-column-end: 4;

        clip-path: polygon(5.94% 28.66%, 100.61% -0.67%, 101.1% 108.57%, 5.4% 126.28%);

        img {
            object-position: 30% 50%;
            height: 135%;
        }
    }
}
</style>