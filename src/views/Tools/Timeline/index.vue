<template>
  <n-el tag="div" class="cards-container">
    <n-thing class="card" v-for="(timeline, index) in timelines" :key="index">
      <template #header> {{ timeline.username }} </template>
      <template #description>
        <n-time
          v-if="Date.now() - timeline.date > 172800000"
          :time="timeline.date"
          type="datetime"
        />
        <n-time v-else :time="timeline.date" type="relative" />
      </template>
      <template #default>
        {{ timeline.content.replace(/./g, "***") }}
      </template>
      <template #header-extra>
        <n-icon size="16">
          <trash-sharp></trash-sharp>
        </n-icon>
      </template>
    </n-thing>
  </n-el>
</template>

<script lang="ts">
import { axios } from "@/utils";
import { TrashSharp } from "@vicons/ionicons5";
import { defineComponent, Ref, ref } from "@vue/runtime-core";

interface Timeline {
  id: number;
  username: string;
  content: string;
  date: string | Date;
}

/** 动态列表 */
const timelines: Ref<Timeline[]> = ref([]);
axios("/timeline/list", {
  method: "get",
}).then((res: Timeline[]) => {
  res.forEach((v) => {
    v.date = new Date(v.date);
  });
  timelines.value = res;
});

const options = ref([
  {
    label: "faq",
    key: "faq",
  },
]);

export default defineComponent({
  components: { TrashSharp },
  setup() {
    return {
      timelines,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>