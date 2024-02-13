<template>
    <v-container class="navi-container">
        <v-row>
            <v-col v-for="item in navis" :key="item.title" cols="12" md="6" lg="4">
                <v-card class="navi-card h-100" :title="item.title" :image="item.background" to="/login" min-height="200">
                    <v-card-text>
                        <p v-for="para in item.introduction" :key="para">{{ para }}</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
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

navis.value = new Array(20).fill({}).map(item => {
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
    &::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: url(https://www.loliapi.com/acg/);
        background-size: cover;
        background-attachment: fixed;
        background-position: center center;
        pointer-events: none;
    }

    .navi-card {
        background-color: rgba(var(--v-theme-background), 0.4);
        backdrop-filter: blur(3px);
        transition: all 0.3s;

        :deep(img) {
            transform: translateY(100%);
            transition: all 0.3s;
        }

        &:hover {
            color: #fff;
            text-shadow: -1px -1px 1px #aaa, 2px 2px 1px #363636;

            :deep(img) {
                transform: translate(0);
            }
        }
    }
}
</style>