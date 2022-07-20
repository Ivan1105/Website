<template>
  <div class="router-container">
    <div class="user-container">
      <img class="icon" :src="userInfo!.icon!" />
      <n-h2 class="username">{{ userInfo!.username }}</n-h2>
    </div>

    <n-divider></n-divider>

    <n-calendar @panelChange="handleMonthUpdate">
      faq
    </n-calendar>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, inject, onMounted } from "@vue/runtime-core";
import { injection } from "@/utils";
import { debounce } from "lodash";

const userInfo = inject(injection.userInfoKey);

const handleMonthUpdate = debounce(
  (info: { year: number; month: number; }) => {
    console.log(info)
  }, 500);
</script>

<style lang="scss" scoped>
.user-container {
  .icon {
    display: block;
    margin: auto;
    width: 180px;
    height: 180px;
    border-radius: 50%;
  }

  .username {
    text-align: center;
  }
}
</style>