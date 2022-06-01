<template>
  <div class="tools-container">
    <n-grid cols="1 m:3 l:4" responsive="screen" x-gap="16" y-gap="20">
      <n-grid-item v-for="tool in toolsList" :key="tool">
        <router-link :to="tool.route">
          <n-card :title="tool.title" hoverable>
            <n-p v-for="des in tool.description" :key="des">{{ des }}</n-p>
          </n-card>
        </router-link>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

/** 工具小卡片 */
interface ToolCard {
  title: string;
  description: string[];
  route: string;
}

const toolsList: ToolCard[] = [
  {
    title: "文件管理（暂时下线）",
    description: ["可以暂时将文件存放在远程服务器上", "此功能还在不断完善中"],
    route: "/tools",
  },
];

export default defineComponent({
  setup() {
    return {
      toolsList,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>