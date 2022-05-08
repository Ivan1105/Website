<template>
  <template v-for="(img, index) in imgs" :key="img">
    <div :class="`img img${index} lazy`" :data-bg="img">
      <Effects v-if="index === 0"></Effects>
      <h2 v-if="index !== imgs.length - 1">
        {{ $t(`home.title${index + 1}`) }}
      </h2>
      <h2 v-else>Ivan1105</h2>
    </div>
    <n-el v-if="index !== imgs.length - 1" tag="div" class="title">
      {{ titles[index] }}
    </n-el>
  </template>

  <n-el tag="footer" class="title footer">
    <a href="//beian.miit.gov.cn/" target="_blank">闽ICP备2021010292号</a>
    <a
      href="//www.beian.gov.cn/portal/registerSystemInfo?recordcode=35032202000179"
      target="_blank"
    >
      <img src="@/assets/beian.png" />
      <span>闽公网安备35032202000179号</span>
    </a>
    <span>Copyright &copy; 2021 - 2022 Ivan. All Rights Reserved.</span>
  </n-el>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import LazyLoad from "vanilla-lazyload";

export default defineComponent({
  setup() {
    const imgs = ref([
      "https://r.photo.store.qq.com/psc?/V14S58Li0s3xIM/45NBuzDIW489QBoVep5mcQuvmyvq*c6.VRbqlSBwy8poeeuHhxc3RjR74FryQP0ScdqkYCLU7TQ5HCc8dWH.3ThdDsdU1utzyJHC03GhEyU!/r",
      "https://r.photo.store.qq.com/psc?/V14S58Li0s3xIM/45NBuzDIW489QBoVep5mcTrrBs0Yhi2s4La8YoUmbitYgR9Vp5jkKvhPnmOe9A3haabIt95ry07W9w.aXpcEWypWmvUJs6MgafaFUpdHlXc!/r",
      "https://r.photo.store.qq.com/psc?/V14S58Li0s3xIM/45NBuzDIW489QBoVep5mcdRQek.qcj3kb0amYyC8rIDXtKZ16df4QYCIhaY6ut5oOSs96lgc*Lr4YGlcfPC7.cS3vJrCPV3uY4QtUALTPeo!/r",
      "https://r.photo.store.qq.com/psc?/V14S58Li0s3xIM/45NBuzDIW489QBoVep5mcdRQek.qcj3kb0amYyC8rIBiu7VNgGw2fTiqgXqewBkHTC5v*7V4ivpeS1Ly4SPXnGkPPktiNoCCXMV*9q0hpzU!/r",
      "https://r.photo.store.qq.com/psc?/V14S58Li0s3xIM/45NBuzDIW489QBoVep5mcTrrBs0Yhi2s4La8YoUmbispZ38*e6LG4O07moEleXMUMu2CLK*R*1Pl0SaPXsf5BZTUKW4wWODgoGipC69PlIo!/r",
    ]);

    const titles = ref([
      "プラネタリウムはいかがでしょう？",
      "どんな時も決して消えることのない",
      "美しい無窮のきらめき",
      "満天の星々が、みなさまをお待ちしています",
    ]);

    onMounted(() => {
      new LazyLoad();
    });

    return { imgs, titles };
  },
});
</script>

<style scoped lang="scss">
@import "./index";
</style>