<template>
  <div class="router-container">
    <div class="user-container">
      <img class="icon" :src="userDetail.icon" />
      <n-h2 class="username">{{ userDetail.username }}</n-h2>
      <div class="follows">
        <n-space justify="center">
          <router-link :to="{ name: 'Followers' }" class="item">
            <div class="header">关注</div>
            <div>{{ userDetail.follows }}</div>
          </router-link>
          <router-link :to="{ name: 'Following' }" class="item">
            <div class="header">粉丝</div>
            <div>{{ userDetail.fans }}</div>
          </router-link>
          <div class="item">
            <div class="header">动态</div>
            <div>0</div>
          </div>
        </n-space>
      </div>

      <nav v-show="uid" class="actions">
        <n-space justify="center">
          <n-button v-if="!userDetail.following" @click="handleActionsClick('follow')">
            <template #icon>
              <n-icon>
                <heart-outline></heart-outline>
              </n-icon>
            </template>
            关注
          </n-button>
          <n-button v-else @click="handleActionsClick('unfollow')">
            <template #icon>
              <n-icon color="#F8312F">
                <Heart></Heart>
              </n-icon>
            </template>
            已关注
          </n-button>
          <n-button>
            <template #icon>
              <n-icon>
                <mail-outline></mail-outline>
              </n-icon>
            </template>
            私信
          </n-button>
        </n-space>
      </nav>
    </div>

    <n-divider />

    <n-h3>TA的动态</n-h3>
    <Timeline :uid="uid"></Timeline>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from "@vue/runtime-core";
import { Heart, HeartOutline, MailOutline } from "@vicons/ionicons5";
import Timeline from "../components/Timeline/index.vue";
import { useRoute, useRouter } from "vue-router";
import { account } from '@/api';

/** 用户信息 */
const userDetail: Ref<account.UserDetail> = ref({
  fans: 0,
  following: false,
  follows: 0,
  icon: '',
  username: '',
});
const uid: Ref<string | undefined> = ref(undefined);

/** 触发动作按钮 */
const handleActionsClick = function (action: "follow" | "unfollow") {
  if (!uid.value) return;
  account.operateOthers(action, uid.value).then(() => {
    if (action === "follow") userDetail.value.following = true;
    else if (action === "unfollow") userDetail.value.following = false;
  });
};

const route = useRoute();
const router = useRouter();

/** 获取用户信息 */
const getUserDetail = function (uid?: string) {
  account.getUserDetail(uid)
    .then((res: account.UserDetail) => {
      userDetail.value = res;
    })
    .catch(() => {
      router.replace("/404");
    });
};

uid.value = String(route.params.uid || '');
watch(
  () => route.params.uid,
  (newVal) => {
    if (route.name !== 'Account' && route.name !== 'AccountId') return;
    if (newVal) uid.value = String(newVal);
    else uid.value = '';
    getUserDetail(uid.value);
  }
);
getUserDetail(uid.value);
</script>

<style lang="scss" scoped>
@import "./index";
</style>