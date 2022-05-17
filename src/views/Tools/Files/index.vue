<template>
  <n-alert title="警告" type="warning">
      此页面还没修改完，临时替换上去的，目前能用，手动刷新
  </n-alert>
  <n-upload style="width: 100%" :action="uploadUrl">
    <n-upload-dragger style="width: 100%">
      <div style="margin-bottom: 12px; width: 100vw">
        <n-icon size="48" :depth="3">
          <archive-icon />
        </n-icon>
      </div>
      <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
    </n-upload-dragger>
  </n-upload>
  <n-data-table :columns="columns" :data="data" />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  h,
  onMounted,
  ref,
  Ref,
} from "@vue/runtime-core";
import { DataTableColumns, NButton } from "naive-ui";
import { axios } from "@/utils";
import { ArchiveOutline as ArchiveIcon } from "@vicons/ionicons5";

interface TableFile {
  hashName: string;
  originName: string;
  createTime: string;
  size: number;
  tags?: string[];
}

const columns: DataTableColumns<TableFile> = [
  { title: "文件名", key: "originName" },
  {
    title: "操作",
    key: "action",
    render(row) {
      return h(
        NButton,
        {
          onClick: () => {
            location.href =
              process.env.VUE_APP_API_URL +
              "cloud/fileDownload?file=" +
              row.hashName;
          },
        },
        { default: () => "下载" }
      );
    },
  },
];

let data: Ref<TableFile[]> = ref([]);

export default defineComponent({
  components: { ArchiveIcon },
  setup() {
    onMounted(() => {
      axios({
        method: "get",
        url: "/cloud/fileList",
      }).then((res) => {
        data.value = res.data.list;
      });
    });
    return {
      columns,
      data,
      uploadUrl: computed(() => {
        return process.env.VUE_APP_API_URL + "cloud/fileUpload";
      }),
    };
  },
});
</script>