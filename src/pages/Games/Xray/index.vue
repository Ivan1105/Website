<template>
    <div class="xray-container">
        <div ref="container" class="container"></div>
        <nav class="nav">
            <v-btn rounded="small" @click="handleNext">完成</v-btn>
        </nav>
    </div>
</template>

<script lang="ts" setup>
import * as zrender from 'zrender';

const container = ref<HTMLDivElement>();
const imgs = new Array(28).fill(0).map((v, i) => `/${i + 1}.png`);


let zr: ReturnType<typeof zrender.init>;

/** 添加图片 */
const addImage = async function (url: string, options: { zindex?: number } = {}) {
    const img = new Image();
    img.src = url;
    await new Promise(resolve => {
        img.onload = resolve
    });

    const [width, height] = [zr.getWidth(), zr.getHeight()];
    if (!width || !height) return;
    const [anchorX, anchorY] = [width / 2, height / 2];
    let [w, h] = [img.width, img.height];
    const ratio = Math.max(w / width, h / height);
    w /= ratio;
    h /= ratio;

    const pic = new zrender.Image({
        style: {
            image: url,
            x: anchorX - w / 2,
            y: anchorY - h / 2,
            width: w,
            height: h,
        },
        z: options.zindex,
        cursor: 'grab'
    })

    zr.add(pic);
    return pic;
}

/** 鼠标事件监听 */
const handler = function (pic: zrender.Image) {
    const clipPaths = new zrender.CompoundPath({ shape: { paths: [] } })
    return function (e: zrender.ElementEvent) {
        const event: MouseEvent = e.event as any;
        if (!e.event.zrByTouch && event.buttons !== 1) return;
        let { zrX, zrY } = e.event;
        if (zrX % 10 >= 5) zrX = (zrX / 10 | 0) * 10 + 10;
        else zrX = (zrX / 10 | 0) * 10;
        if (zrY % 10 >= 5) zrY = (zrY / 10 | 0) * 10 + 10;
        else zrY = (zrY / 10 | 0) * 10;

        const path = new zrender.Circle({
            shape: {
                cx: zrX,
                cy: zrY,
                r: 30
            }
        });
        if (clipPaths.shape.paths.find((item) => item.shape.cx === zrX && item.shape.cy === zrY)) return;

        clipPaths.shape.paths.push(path);
        pic.setClipPath(clipPaths);
        pic.show();
    }
}

/** 阶段开始 */
const startStage = async function (index: number) {
    const [i, j] = [index, index + 1];
    if (j >= imgs.length) return false;

    zr.resize();
    zr.clear();
    const pic1 = await addImage(imgs[i], { zindex: 1 });
    const pic2 = await addImage(imgs[j], { zindex: 2 });
    if (!pic1 || !pic2) return;
    pic2.hide();
    zr.on('mousemove', handler(pic2));
    return true;
}

let stage = -1;
/** 触发下一阶段 */
const handleNext = function () {
    stage++;
    startStage(stage);
}

onMounted(async () => {
    const main = container.value;
    if (!main) return;
    zr = zrender.init(main);
})

onBeforeUnmount(() => {
    zr.dispose();
})
</script>

<style lang="scss" scoped>
.xray-container {
    height: 100%;
    position: relative;
}

.container {
    height: 100%;
    background-color: #555;
}

.nav {
    position: absolute;
    top: 30px;
    right: 20px;
}
</style>