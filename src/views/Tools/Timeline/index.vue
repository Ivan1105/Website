<template>
  <n-el tag="div" class="cards-container">
    <n-spin :show="isSending">
      <n-el tag="div" class="card-add">
        <n-input
          v-model:value="newTimeline"
          placeholder="发布一条新动态"
          type="textarea"
          autosize
          show-count
          maxlength="500"
        />
        <n-button
          round
          type="primary"
          @click="addTimeline"
          :disabled="newTimeline === ''"
        >
          发送
        </n-button>
      </n-el>
    </n-spin>

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
        {{ timeline.content }}
      </template>
      <template #header-extra>
        <n-button text @click="removeTimeline(timeline)">
          <template #icon>
            <n-icon>
              <trash-sharp></trash-sharp>
            </n-icon>
          </template>
        </n-button>
      </template>
    </n-thing>

    <n-empty v-if="timelines.length === 0" description="还没有发表过动态哦" />
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

/** 新增的动态内容 */
const newTimeline = ref("");
const isSending = ref(false);
const addTimeline = function () {
  isSending.value = true;
  axios("/timeline/add", {
    method: "post",
    data: {
      content: newTimeline.value,
    },
  })
    .then((res: Timeline) => {
      res.date = new Date(res.date);
      timelines.value.unshift(res);
      newTimeline.value = "";
    })
    .finally(() => {
      isSending.value = false;
    });
};

/** 移除动态 */
const removeTimeline = function (tar: Timeline) {
  const id = tar.id;
  const d = window.dialog?.warning({
    title: "警告",
    content: "这条动态的存在即将被你永久抹去",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      d!.loading = true;
      return new Promise<void>((resolve) => {
        axios("/timeline/remove", {
          method: "post",
          data: {
            id,
          },
        }).then(() => {
          timelines.value.splice(timelines.value.indexOf(tar), 1);
          resolve();
        });
      });
    },
  });
};

export default defineComponent({
  components: { TrashSharp },
  setup() {
    return {
      timelines,
      newTimeline,
      addTimeline,
      isSending,
      removeTimeline,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>