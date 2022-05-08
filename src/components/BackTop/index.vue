<template>
  <div ref="backTop" class="back-top" @click="scrollToTop">
    <img src="./back-top.png" alt="back to top" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "@vue/runtime-core";

export default defineComponent({
  setup() {
    const backTop: Ref<null | HTMLElement> = ref(null);
    onMounted(() => {
      window.onscroll = function () {
        const scrollTop = document.querySelector("html")!.scrollTop;
        if (scrollTop > 180) backTop.value?.classList.add("show");
        else if (!backTop.value?.classList.contains("scrolling"))
          backTop.value?.classList.remove("show");
        if (backTop.value?.offsetTop && backTop.value?.offsetTop < 0)
          backTop.value?.classList.remove("scrolling", "show");
      };
    });

    function scrollToTop() {
      backTop.value?.classList.add("scrolling");
      window.scrollTo({ top: 0, behavior: "smooth" });
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