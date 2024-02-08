<template>
  <background-title v-for="(img, index) in imgs" :key="index" :img="img" :title="titles[index]"
    :sub-title="subTitles[index]" :cover-style="styles[index]" :effect="index === 0" />

  <footer class="title footer">
    <a class="text-grey-darken-1" href="https://beian.miit.gov.cn/" target="_blank">闽ICP备2021010292号</a>
    <a class="text-grey-darken-1" href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35032202000179"
      target="_blank">
      <img src="@/assets/beian.png" />
      <span>闽公网安备35032202000179号</span>
    </a>
    <span>Copyright &copy; 2021 - 2024 Ivan. All Rights Reserved.</span>
  </footer>
</template>

<script lang="ts" setup>
/** 背景图片列表 */
const imgs = ref([
  "https://oss.ivan1105.top/static/view-1.jpg",
  "https://oss.ivan1105.top/static/view-2.jpg",
  "https://oss.ivan1105.top/static/view-3.png",
  "https://oss.ivan1105.top/static/view-4.jpg",
  "https://oss.ivan1105.top/static/view-5.png",
]);

/** 样式列表 */
const styles = ref<Record<string, string>[]>([
  {
    "background-color": "#181a3e"
  },
  {
    "background-color": "#1f3b5c"
  },
  {
    "background-color": "#0066b6"
  },
  {
    "background-color": "#3d669d"
  },
  {
    "background-color": "#fafbfd",
    "background-position": "0 0",
    "font-size": "3vmax"
  },
]);

/** 图片文字列表 */
const titles = ref([
  '欢迎光临星象馆',
  '这里有无论何时都不会消失',
  '美丽的无穷光辉',
  '漫天繁星等候您的到来',
  'Ivan1105'
]);

/** 副标题列表 */
const subTitles = ref([
  "プラネタリウムはいかがでしょう？",
  "どんな時も決して消えることのない",
  "美しい無窮のきらめき",
  "満天の星々が、みなさまをお待ちしています",
]);
</script>

<style lang="scss" scoped>
.footer {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 20vh;

  a {
    display: flex;
    align-items: center;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>