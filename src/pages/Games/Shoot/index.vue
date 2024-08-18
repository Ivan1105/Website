<template>
    <input ref="controller" class="controller" autofocus @keypress.prevent @keydown="handleKeydown" @keyup="handleKeyUp" />
    <div ref="container" class="container" @click="handleFocus"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { onBeforeUnmount } from 'vue';
import { ref } from 'vue';
import { zr, COLUMNS, COLUMN_WIDTH, Z_LEVELS, Player, Enemy, zrender } from './';

const controller = ref<HTMLInputElement>();
const container = ref<HTMLDivElement>();

let player: Player | null = null;
let enemy: Enemy | null = null;

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
    })

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

    for (let i = 1; i < COLUMNS; i++) {
        const line = new zrender.Line({
            shape: {
                x1: COLUMN_WIDTH() * i,
                y1: 0,
                x2: COLUMN_WIDTH() * i,
                y2: height,
            },
            style: {
                stroke: '#ffffff77',
                lineWidth: 1
            },
            zlevel
        });
        zr.value.add(line);
    }
}

/** 获取焦点 */
const handleFocus = function () {
    controller.value?.focus();
}

/** 操作 */
const handleKeydown = function (e: KeyboardEvent) {
    switch (e.code) {
        case 'ArrowRight':
            player?.moveRight();
            break;
        case 'ArrowLeft':
            player?.moveLeft();
            break;
        case 'KeyZ':
            if (enemy) player?.startShoot(enemy);
            break;
        case 'KeyR':
            player?.destroy();
            enemy?.destroy();
            break;
        default:
            console.log(e.code);
    }
}

/** 松开按键 */
const handleKeyUp = function (e: KeyboardEvent) {
    switch (e.code) {
        case 'KeyZ':
            player?.stopShoot();
            break;
    }
}

const urls: Record<string, { src: string, zindex: number }> = {
    base: {
        src: 'base',
        zindex: 1,
    },
    swimsuit: {
        src: 'swimsuit',
        zindex: 2,
    },
    emotion1: {
        src: 'emotion1',
        zindex: 3
    },
    emotion2: {
        src: 'emotion2',
        zindex: 3,
    },
    emotion3: {
        src: 'emotion3',
        zindex: 3,
    },
    sweet1: {
        src: 'sweet1',
        zindex: 4
    },
    sweet2: {
        src: 'sweet2',
        zindex: 4,
    },
    nipple: {
        src: 'nipple',
        zindex: 5,
    },
    belt: {
        src: 'belt',
        zindex: 6,
    },
    coat: {
        src: 'coat',
        zindex: 7
    }
};
const imgs: Record<string, zrender.Image> = {};
const stageInfo: { percent: number, show?: string[], hide?: string[], appear?: string[], disappear?: string[] }[] = [
    {
        percent: 1,
        show: ['base', 'swimsuit', 'emotion1', 'belt', 'coat']
    },
    {
        percent: 0.6,
        hide: ['coat']
    },
    {
        percent: 0.3,
        show: ['sweet1'],
        hide: ['belt'],
        appear: ['emotion3'],
        disappear: ['emotion1']
    },
    {
        percent: 0,
        show: ['fog', 'sweet2', 'nipple'],
        hide: ['swimsuit'],
        appear: ['emotion2'],
        disappear: ['emotion3']
    }
]
// let pic1: zrender.Image;
// let pic2: zrender.Image;
let frame = 0;
/** 每一帧刷新 */
const update = function () {
    player?.update();
    enemy?.update();

    if (enemy) {
        const { life, maxLife } = enemy.getLife();
        const percent = life / maxLife;

        let lastStage = 1;
        stageInfo.some(stage => {
            if (percent <= stage.percent) {
                stage.show?.forEach(item => {
                    imgs[item]?.attr('style', { opacity: 1 });
                });
                stage.hide?.forEach(item => {
                    imgs[item]?.attr('style', { opacity: 0 })
                });
                stage.appear?.forEach(item => {
                    imgs[item]?.attr('style', { opacity: 1 });
                });
                stage.disappear?.forEach(item => {
                    imgs[item]?.attr('style', { opacity: 0 })
                });
            }
            else {
                const opacity = (percent - stage.percent) / (lastStage - stage.percent);

                stage.show?.forEach(item => {
                    // imgs[item]?.stopAnimation()
                    //     .animate('style')
                    //     .when(100, { opacity: 1 - opacity })
                    //     .start();
                    imgs[item]?.attr('style', { opacity: 1 - opacity });
                });
                stage.hide?.forEach(item => {
                    // imgs[item]?.stopAnimation()
                    //     .animate('style')
                    //     .when(100, { opacity })
                    //     .start();
                    imgs[item]?.attr('style', { opacity });
                })
                return true;
            }
            lastStage = stage.percent;
        })
        // pic2.attr('style', {
        //     opacity: life / maxLife
        // })
    }
    frame = window.requestAnimationFrame(update);
}

onMounted(async () => {
    const main = container.value;
    if (!main) return;

    zr.value = zrender.init(main);

    const t = Object.entries(urls);
    for (const [k, v] of t) {
        const img = await addImage(`/Hoshino/${v.src}.png`, { zindex: v.zindex });
        imgs[k] = img;
    }
    drawBase();

    player = new Player({
        maxLife: 100,
        attack: 5,
        shootSpeed: 4,
        shootGap: 5
    })
    enemy = new Enemy({
        maxLife: 500,
        attack: 25,
        shootSpeed: 0,
        shootGap: 1,
        moveSpeed: 0
    });
    enemy.startShoot(player);
    player.startShoot(enemy);
    update();
});

onBeforeUnmount(() => {
    player?.destroy();
    enemy?.destroy();
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

.controller {
    position: absolute;
    opacity: 0;
    z-index: -1;
}
</style>