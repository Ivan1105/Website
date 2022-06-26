<template>
  <div class="router-container">
    <n-tabs class="follow-type" type="line" animated :value="routeName">
      <n-tab name="Followers">
        <router-link :to="{ name: 'Followers' }" replace>谁关注我</router-link>
      </n-tab>
      <n-tab name="Following">
        <router-link :to="{ name: 'Following' }" replace>我的关注</router-link>
      </n-tab>
    </n-tabs>
    <Followers :type="routeName"></Followers>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import { useRoute } from "vue-router";
import Followers from "../components/Followers/index.vue";

const route = useRoute();
const routeName:Ref<string> = ref(String(route.name));
watch(() => route.name, (newVal) => {
  routeName.value = String(newVal);
})
</script>


<style lang="scss" scoped>
@import "./index";
</style>