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

      <nav v-if="Number(uid) !== userInfo?.uid" class="actions">
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
    <Timeline :uid="uid" :key="uid"></Timeline>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, inject, onMounted } from "@vue/runtime-core";
import { Heart, HeartOutline, MailOutline } from "@vicons/ionicons5";
import Timeline from "../components/Timeline/index.vue";
import { useRoute, useRouter } from "vue-router";
import { account } from '@/api';
import { injection } from "@/utils";

type UserDetail = account.UserDetail;

/** 用户信息 */
const userDetail: Ref<UserDetail> = ref({
  fans: 0,
  following: false,
  follows: 0,
  icon: '',
  username: '',
});

const route = useRoute();
const router = useRouter();

const uid: Ref<string> = ref(route.params.uid as string);
const userInfo = inject(injection.userInfoKey);

/** 触发动作按钮 */
const handleActionsClick = function (action: "follow" | "unfollow") {
  account.operateOthers(action, uid.value).then(() => {
    if (action === "follow") userDetail.value.following = true;
    else if (action === "unfollow") userDetail.value.following = false;
  });
};


/** 获取用户信息 */
const getUserDetail = function () {
  account.getUserDetail(uid.value)
    .then(res => {
      userDetail.value = res;
    })
    .catch(() => {
      router.replace("/404");
    });
};
onMounted(getUserDetail);
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

  .follows {
    margin-top: 1em;

    .item {
      text-align: center;

      .header {
        font-weight: bold;
      }
    }
  }

  .actions {
    margin-top: 1em;
  }
}
</style>