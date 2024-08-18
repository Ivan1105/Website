<template>
    <!-- <input ref="controller" class="controller" autofocus @keypress.prevent @keydown="handleKeydown" @keyup="handleKeyUp" /> -->
    <div ref="container" class="container" @click="test"></div>
</template>

<script lang="ts" setup>
import { zr, COLUMNS, COLUMN_WIDTH, Z_LEVELS, Player, Enemy, zrender } from './';
import { getLevelInfo, UrlsType, StageType } from './levels';

const container = ref<HTMLDivElement>();

/** 添加图片 */
const addImage = async function (url: string, options: { zindex?: number } = {}) {
    const img = new Image();
    img.src = url;
    await new Promise(resolve => {
        img.onload = resolve
    });

    const [width, height] = [zr.value.getWidth()!, zr.value.getHeight()!];

    let [w, h] = [img.width, img.height];
    const ratio = Math.max(w / width, h / height);
    w /= ratio;
    h /= ratio;

    zr.value.resize({ width: w, height: h });

    const pic = new zrender.Image({
        style: {
            image: img,
            x: 0,
            y: 0,
            width: w,
            height: h,
            opacity: 0
        },
        zlevel: Z_LEVELS.image,
        z: options.zindex
    });

    zr.value.add(pic);
    return pic;
}

/** 绘制背景 */
const drawBase = function (zlevel = Z_LEVELS.base) {
    const [width, height] = [zr.value.getWidth(), zr.value.getHeight()];

    const bg = new zrender.Rect({
        shape: {
            x: 0,
            y: 0,
            width,
            height
        },
        style: {
            fill: '#00000000',
            // fill: '#00000066',
        },
        zlevel
    });
    zr.value.add(bg);

    // for (let i = 1; i < COLUMNS; i++) {
    //     const line = new zrender.Line({
    //         shape: {
    //             x1: COLUMN_WIDTH() * i,
    //             y1: 0,
    //             x2: COLUMN_WIDTH() * i,
    //             y2: height,
    //         },
    //         style: {
    //             stroke: '#ffffff77',
    //             lineWidth: 1
    //         },
    //         zlevel
    //     });
    //     zr.value.add(line);
    // }
}

const imgs: Record<string, zrender.Image> = {};

// let pic1: zrender.Image;
// let pic2: zrender.Image;
let frame = 0;
/** 每一帧刷新 */
const update = function () {
    frame = window.requestAnimationFrame(update);
}

let stage = -1;
const test = function () {
    stage++;
    if (stage >= stageInfo.length) return;
    const curStage = stageInfo[stage];
    const animateDone = function () {
        curStage.appear?.forEach(item => {
            imgs[item].attr('style', { opacity: 1 });
        });
        curStage.disappear?.forEach(item => {
            imgs[item].attr('style', { opacity: 0 });
        });
    };
    curStage.show?.forEach(item => {
        imgs[item]?.stopAnimation()
            .animate('style')
            .when(1000, { opacity: 1 })
            .done(animateDone)
            .start();
    });
    curStage.hide?.forEach(item => {
        imgs[item]?.stopAnimation()
            .animate('style')
            .when(1000, { opacity: 0 })
            .done(animateDone)
            .start();
    });
    if (!curStage.show && !curStage.hide) animateDone();
}

let urls: UrlsType = {};
let stageInfo: StageType = [];

onMounted(async () => {
    const main = container.value;
    if (!main) return;

    const res = await getLevelInfo('level_01');
    urls = res.urls;
    stageInfo = res.stageInfo;
    zr.value = zrender.init(main);

    const t = Object.entries(urls);
    for (const [k, v] of t) {
        const img = await addImage(v.src, { zindex: v.zindex });
        imgs[k] = img;
    }
    drawBase();

    // window.requestAnimationFrame(update);
});

onBeforeUnmount(() => {
    window.cancelAnimationFrame(frame);
    zr.value.dispose();
});
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>.