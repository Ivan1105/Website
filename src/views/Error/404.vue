<template>
  <n-result
    status="404"
    title="404 Not Found"
    description="你找到了这里，要么是你输错了网址，要么是功能我还没写"
    class="full-height"
  ></n-result>
</template>

<style lang="scss" scoped>
@import "@/assets/vars.scss";
.n-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>