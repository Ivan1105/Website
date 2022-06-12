<template>
  <div class="router-container">
    <div class="user-container">
      <img
        class="icon"
        src="http://127.0.0.1:8000/icons/f8e7f28b0c52800da80d40b018246e0871916f28ccb699a7545317e2ae361561.jpg"
      />
      <div class="follows">
        <n-space justify="center">
          <div class="item">
            <div class="header">关注</div>
            <div>0</div>
          </div>
          <div class="item">
            <div class="header">粉丝</div>
            <div>0</div>
          </div>
          <div class="item">
            <div class="header">动态</div>
            <div>0</div>
          </div>
        </n-space>
      </div>
      <nav class="actions">
        <n-space justify="center">
          <n-button>
            <template #icon>
              <n-icon>
                <heart-outline></heart-outline>
              </n-icon>
            </template>
            关注
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
    <Timeline></Timeline>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { HeartOutline, MailOutline } from "@vicons/ionicons5";
import Timeline from "../components/Timeline/index.vue";

export default defineComponent({
  components: { HeartOutline, MailOutline, Timeline },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>