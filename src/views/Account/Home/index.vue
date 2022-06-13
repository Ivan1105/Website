<template>
  <div class="router-container">
    <div class="user-container">
      <img class="icon" :src="userDetail.icon" />
      <div class="follows">
        <n-space justify="center">
          <div class="item">
            <div class="header">关注</div>
            <div>{{ userDetail.follows }}</div>
          </div>
          <div class="item">
            <div class="header">粉丝</div>
            <div>{{ userDetail.fans }}</div>
          </div>
          <div class="item">
            <div class="header">动态</div>
            <div>0</div>
          </div>
        </n-space>
      </div>
      <nav v-show="$route.params.uid" class="actions">
        <n-space justify="center">
          <n-button
            v-if="!userDetail.following"
            @click="handleActionsClick('follow')"
          >
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

<script lang="ts">
import { defineComponent, Ref, ref, watch } from "@vue/runtime-core";
import { Heart, HeartOutline, MailOutline } from "@vicons/ionicons5";
import Timeline from "../components/Timeline/index.vue";
import { useRoute, useRouter } from "vue-router";
import { axios, path } from "@/utils";

interface UserDetail {
  username?: string;
  icon?: string;
  follows?: number;
  fans?: number;
  following?: boolean;
}
/** 用户信息 */
const userDetail: Ref<UserDetail> = ref({});
const uid: Ref<string | string[] | undefined> = ref(undefined);

/** 触发动作按钮 */
const handleActionsClick = function (action: "follow" | "unfollow") {
  axios("/account/operateOthers", {
    method: "post",
    data: {
      uid: uid.value,
      action,
    },
  }).then(() => {
    if(action==="follow") userDetail.value.following = true;
    else if(action==="unfollow") userDetail.value.following = false;
  });
};

export default defineComponent({
  components: { Heart, HeartOutline, MailOutline, Timeline },
  setup() {
    const $route = useRoute();
    const $router = useRouter();

    /** 获取用户信息 */
    const getUserDetail = function (uid?: string | string[]) {
      if (!uid) uid = "";
      axios(`/account/getUserDetail/${uid}`)
        .then((res: UserDetail) => {
          res.icon = path.icon(res.icon!);
          userDetail.value = res;
        })
        .catch(() => {
          $router.replace({ name: "Account" });
        });
    };

    uid.value = $route.params.uid;
    watch(
      () => $route.params.uid,
      (newVal) => {
        uid.value = newVal;
        getUserDetail(newVal);
      }
    );
    getUserDetail(uid.value);

    return {
      uid,
      userDetail,
      $route,
      handleActionsClick,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>