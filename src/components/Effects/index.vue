<template>
  <canvas ref="canvas" class="effect-canvas"></canvas>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  Ref,
  ref,
} from "@vue/runtime-core";
import Effects from "./effects";

/** 粒子效果 */
let effect: null | Effects = null;

export default defineComponent({
  setup() {
    const canvas: Ref<null | HTMLCanvasElement> = ref(null);
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

    return {
      canvas,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>