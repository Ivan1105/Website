<template>
  <div class="router-container">
    <div class="user-container">
      <img class="icon" :src="userInfo!.icon!" />
      <n-h2 class="username">{{ userInfo!.username }}</n-h2>
    </div>

    <n-divider></n-divider>

    <n-calendar #="{ year, month, date }" @panelChange="handleMonthUpdate" @update:value="handleDateUpdate">
      <div v-if="year === currentCounts.year && month === currentCounts.month && currentCounts.counts[date] > 0">
        {{ currentCounts.counts[date] }}条动态
      </div>
    </n-calendar>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, inject, onMounted, reactive } from "@vue/runtime-core";
import { injection } from "@/utils";
import { debounce } from "lodash";
import { timeline } from "@/api";

type Counts = timeline.Counts;
const userInfo = inject(injection.userInfoKey);

/** 内存暂时记录每个月发布的动态数 */
const counts = new Map<string, Counts>();
/** 当前月份发布动态情况 */
const currentCounts = reactive({
  year: 1970,
  month: 1,
  counts: {} as Counts
})

/** 从服务器加载统计数据 */
const loadCountsFromServer = debounce(
  ({ year, month }: { year: number; month: number; }) => {
    const key = `${year}-${month}`;

    const begin = new Date(key).toISOString();
    const end = new Date(`${month === 12 ? year + 1 : year}-${month === 12 ? 1 : month + 1}`).toISOString();
    timeline.countsByDate({ begin, end }).then(res => {
      counts.set(key, res);
      if (year !== currentCounts.year || month !== currentCounts.month) return;
      currentCounts.counts = res;
    })
  }, 300);

/** 月份更新加载当月发布动态情况 */
const handleMonthUpdate = function ({ year, month }: { year: number; month: number; }) {
  if (month > 12) month = new Date(month).getMonth() + 1;
  const key = `${year}-${month}`;
  const tmp = counts.get(key);
  currentCounts.year = year;
  currentCounts.month = month;
  currentCounts.counts = {};
  if (tmp !== undefined) {
    loadCountsFromServer.cancel();
    currentCounts.counts = tmp;
    return;
  }

  loadCountsFromServer({ year, month });
};

/** 选中的日期发生变化 */
const handleDateUpdate = function (timestamp: number, { year, month }: { year: number, month: number }) {
  handleMonthUpdate({ year, month });
}

onMounted(() => {
  const now = new Date();
  const [year, month] = [now.getFullYear(), now.getMonth() + 1];
  currentCounts.year = year;
  currentCounts.month = month;
  loadCountsFromServer({ year: year, month: month })
})
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