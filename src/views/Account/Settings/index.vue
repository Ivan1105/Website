<template>
  <n-grid
    class="settings-container"
    cols="1 m:2"
    responsive="screen"
    x-gap="16"
    y-gap="20"
  >
    <n-grid-item>
      <n-el tag="span" class="icon-container">
        <img class="icon" src="@/assets/login-bg.jpg" alt="icon" />
        <div class="mask" @click="handleIconClick">更改头像</div>
      </n-el>
      <input
        v-show="false"
        ref="iconUploader"
        type="file"
        accept="image/png, image/jpeg"
        @change="handleIconChange"
      />
      <n-modal v-model:show="showModal" :mask-closable="false">
        <n-card
          class="icon-adjust"
          title="调整头像"
          closable
          @close="handleCloseModal"
        >
          <template #default>
            <div class="icon-container">
              <img ref="newIcon" :src="cropIcon" />
            </div>
          </template>
          <template #action>
            <n-space justify="end">
              <n-button @click="handleCloseModal">取消</n-button>
              <n-button @click="handleCropIcon" type="primary">确定</n-button>
            </n-space>
          </template>
        </n-card>
      </n-modal>
      <!-- <button @click="cropImage">click</button> -->
    </n-grid-item>
    <n-grid-item>233</n-grid-item>
    <n-grid-item>233</n-grid-item>
    <n-grid-item>233</n-grid-item>
  </n-grid>
</template>

<script lang="ts">
import { axios } from "@/utils";
import { defineComponent, nextTick, Ref, ref } from "@vue/runtime-core";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

/** 待裁剪图像 */
const cropIcon = ref("");
const newIcon: Ref<null | HTMLImageElement> = ref(null);
const cropper: Ref<null | Cropper> = ref(null);
const cropImage = function () {
  if (newIcon.value === null) return;
  cropper.value?.destroy();
  cropper.value = new Cropper(newIcon.value, {
    aspectRatio: 1,
    viewMode: 1,
  });
};
const handleCropIcon = function () {
  if (cropper.value === null) return;
  const cas = cropper.value.getCroppedCanvas();
  const base64url = cas.toDataURL("image/jpeg");
  axios("/account/updateIcon", {
    method: "post",
    data: {
      file: base64url,
    },
  }).then(() => {
    location.reload();
  });
};

/** 文件上传器 */
const iconUploader: Ref<null | HTMLInputElement> = ref(null);
const showModal = ref(false);
const handleIconClick = function () {
  if (iconUploader.value === null) return;
  iconUploader.value.value = "";
  iconUploader.value.click();
};
const handleIconChange = function (e: any) {
  const img = e.target.files[0];
  cropIcon.value = URL.createObjectURL(img);
  console.log(cropIcon.value);
  showModal.value = true;
  nextTick(() => {
    cropImage();
  });
};
const handleCloseModal = function () {
  showModal.value = false;
};

export default defineComponent({
  setup() {
    return {
      newIcon,
      cropIcon,
      showModal,
      iconUploader,
      handleCloseModal,
      handleIconClick,
      handleIconChange,
      handleCropIcon,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>