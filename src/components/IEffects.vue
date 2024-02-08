<!-- 
  canvas动画效果
 -->
<template>
  <canvas ref="canvas" class="effect-canvas"></canvas>
</template>

<script lang="ts" setup>
import Effects from "./IEffects/effects";

/** 粒子效果 */
let effect: null | Effects = null;

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  if (canvas.value) {
    effect = new Effects(canvas.value);
    const rand = Math.random();
    if (rand <= 0.33) effect.createRains(80);
    else if (rand <= 0.67) effect.createSakuras(50);
    else effect.createSnows(500);
    effect.start();
  }
});

onBeforeUnmount(() => {
  effect?.stop();
});
</script>

<style lang="scss" scoped>
.effect-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>