<template>
  <div ref="backTop" class="back-top" @click="scrollToTop">
    <img src="./back-top.png" alt="back to top" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "@vue/runtime-core";
import { scrollTo } from "@/utils";

export default defineComponent({
  setup() {
    const backTop: Ref<null | HTMLElement> = ref(null);
    let backTopCounter = 2;
    onMounted(() => {
      window.onscroll = function () {
        const scrollTop = document.querySelector("html")!.scrollTop;
        if (scrollTop > 180) backTop.value?.classList.add("show");
        else if (!backTop.value?.classList.contains("scrolling"))
          backTop.value?.classList.remove("show");
      };

      backTop.value?.addEventListener("animationend", () => {
        backTopCounter--;
        if (backTopCounter === 0) resetBackTopCounter();
      });
    });

    function scrollToTop() {
      backTop.value?.classList.add("scrolling");
      scrollTo(0).then(() => {
        backTopCounter--;
        if (backTopCounter === 0) resetBackTopCounter();
      });
    }

    function resetBackTopCounter() {
      backTopCounter = 2;
      backTop.value?.classList.remove("show", "scrolling");
    }

    return {
      backTop,
      scrollToTop,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>