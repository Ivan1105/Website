<template>
  <n-el tag="div" class="cards-container">
    <!-- 发送框 -->
    <n-spin v-if="editable" :show="isSending">
      <n-el tag="div" class="card-add">
        <n-input v-model:value="newTimeline" placeholder="发布一条新动态" type="textarea" :autosize="{ minRows: 3 }" show-count
          maxlength="500" @keyup.ctrl.enter="addTimeline" />
        <n-button round type="primary" @click="addTimeline" :disabled="newTimeline.trim().length === 0">
          发送
        </n-button>
      </n-el>
    </n-spin>

    <n-thing class="card" v-for="timeline in timelines" :key="timeline.id">
      <template #header> {{ timeline.username }} </template>
      <template #description>
        <n-time v-if="Date.now() - timeline.date.getTime() > 172800000" :time="timeline.date" type="datetime" />
        <n-time v-else :time="timeline.date" type="relative" />
      </template>
      <template #default>
        {{ timeline.content }}
      </template>

      <template v-if="editable" #header-extra>
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

    <infinite-scroll @update:loading="loadTimeline(uid)" v-model:loading="loading" :finished="finished">
    </infinite-scroll>
  </n-el>
</template>

<script lang="ts" setup>
import { timeline } from '@/api';
import { TrashSharp } from "@vicons/ionicons5";
import { Ref, ref, defineProps, onUpdated } from "@vue/runtime-core";
import InfiniteScroll from "@/components/InfiniteScroll/index.vue";

type Timeline = timeline.Timeline;

const props = defineProps({
  editable: Boolean,
  uid: String
})

/** 动态列表 */
const timelines: Ref<Timeline[]> = ref([]);
/** 正在加载 */
const loading = ref(false);
/** 完成加载 */
const finished = ref(false);
/** 当前页数 */
let pageNum = 1;
/** 每页大小 */
const pageSize = 10;
/** 获取对应用户的动态 */
const loadTimeline = function (uid?: string) {
  timeline.list({ uid, pageNum, pageSize }).then(res => {
    res.forEach(v => {
      v.content = v.content.replace(/./g, '*');
    });
    if (res.length <= pageSize)
      finished.value = true;
    else {
      res.pop();
      pageNum++;
    }
    timelines.value.push(...res);
    loading.value = false;
  });
};

/** 新增的动态内容 */
const newTimeline = ref("");
/** 正在发布 */
const isSending = ref(false);
const addTimeline = function () {
  if (newTimeline.value.trim().length === 0) return;
  isSending.value = true;
  timeline.add(newTimeline.value).then(res => {
    timelines.value.unshift(res);
    newTimeline.value = "";
  }).finally(() => {
    isSending.value = false;
  });
};

/** 移除动态 */
const removeTimeline = function (tar: Timeline) {
  const d = window.dialog!.warning({
    title: "警告",
    content: "这条动态的存在即将被你永久抹去",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      d.loading = true;
      await timeline.remove(tar.id);
      timelines.value.splice(timelines.value.indexOf(tar), 1);
    },
  });
};
</script>

<style lang="scss" scoped>
@import "./index";
</style>