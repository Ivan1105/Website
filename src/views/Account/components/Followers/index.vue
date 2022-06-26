<template>
  <n-el tag="div" class="follower" v-for="(follower, index) in followers" :key="index" @click="jumpTo(follower.id)">
    <div class="header">
      <img class="icon" :src="follower.icon" />
      <n-h5 class="username">{{ follower.username }}</n-h5>
    </div>
    <div class="action">
      <n-button v-if="follower.following === 0" round @click.stop="handleActionsClick('follow', follower)">关注</n-button>
      <n-button v-else round @click.stop="handleActionsClick('unfollow', follower)">取消关注</n-button>
    </div>
  </n-el>
  <n-empty v-if="type === 'Followers' && followers.length === 0" description="还没有人关注你哦" />
  <n-empty v-else-if="type === 'Following' && followers.length === 0" description="你还没有关注的人哦" />
</template>

<script lang="ts" setup>
import { Ref, ref, defineProps, watch } from "vue";
import { useRouter } from "vue-router";
import { account } from '@/api';

const props = defineProps({
  type: {
    type: String,
  },
});

interface Follower {
  id: number;
  icon: string;
  username: string;
  following?: number;
}
const followers: Ref<Follower[]> = ref([]);

const router = useRouter();

/** 获取关注列表 */
const updateFollowers = function (type?: string) {
  account.getFollow(type).then((res: Follower[]) => {
    followers.value = res;
  });
}
updateFollowers(props.type);
watch(() => props.type, (newVal) => {
  updateFollowers(newVal);
})

const handleActionsClick = function (action: 'follow' | 'unfollow', follower: Follower) {
  account.operateOthers(action, follower.id).then(() => {
    if (action === 'follow') follower.following = 1;
    else follower.following = 0;
  })
}

const jumpTo = function (uid: number) {
  router.push({ name: "AccountId", params: { uid } });
};
</script>

<style lang="scss" scoped>
@import "./index";
</style>