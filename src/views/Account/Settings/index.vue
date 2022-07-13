<template>
  <div class="router-container">
    <div class="icon-container">
      <img class="icon" :src="userInfo.icon!" alt="icon" />
      <div class="mask" @click="handleIconClick">更改头像</div>
    </div>
    <input v-show="false" ref="iconUploader" type="file" accept="image/png, image/jpeg" @change="handleIconChange" />
    <n-modal v-model:show="showModal" :mask-closable="false">
      <n-spin :show="uploadingIcon">
        <n-card class="icon-adjust" title="调整头像" closable @close="handleCloseModal">
          <template #default>
            <div class="icon-container">
              <img ref="newIcon" :src="cropIcon" />
            </div>
          </template>
          <template #action>
            <n-space justify="end">
              <n-button @click="handleCloseModal">取消</n-button>
              <n-button @click="handleCropIcon" type="primary"> 确定 </n-button>
            </n-space>
          </template>
        </n-card>
      </n-spin>
    </n-modal>

    <n-form>
      <n-grid cols="1 m:2" responsive="screen" x-gap="16" y-gap="20">
        <n-grid-item span="2">
          <n-h3>个人资料</n-h3>
        </n-grid-item>
        <n-form-item-gi label="用户名">
          <n-input disabled :value="userInfo.username" />
        </n-form-item-gi>
      </n-grid>
    </n-form>

    <n-form ref="passwordForm" :model="setPassword" :rules="passwordRules">
      <n-grid cols="1 m:2" responsive="screen" x-gap="16" y-gap="20">
        <n-grid-item span="2">
          <n-h3>修改密码</n-h3>
        </n-grid-item>
        <n-form-item-gi path="oldPassword" label="旧密码">
          <n-input v-model:value="setPassword.oldPassword" type="password"
            :input-props="{ autocomplete: 'current-password' }" />
        </n-form-item-gi>
        <n-form-item-gi path="newPassword" label="新密码">
          <n-input v-model:value="setPassword.newPassword" type="password"
            :input-props="{ autocomplete: 'new-password' }" />
        </n-form-item-gi>
        <n-form-item-gi path="repeat" label="重复密码">
          <n-input v-model:value="setPassword.repeat" type="password" :input-props="{ autocomplete: 'off' }" />
        </n-form-item-gi>
        <n-grid-item span="2">
          <n-button type="primary" @click="handleUpdatePassword">提交</n-button>
        </n-grid-item>
      </n-grid>
    </n-form>
  </div>
</template>

<script lang="ts">
import { axios, injection, matchRule } from "@/utils";
import {
  defineComponent,
  inject,
  nextTick,
  reactive,
  Ref,
  ref,
} from "@vue/runtime-core";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { FormInst, FormRules } from "naive-ui";

/** 待裁剪图像 */
const cropIcon = ref("");
const newIcon: Ref<null | HTMLImageElement> = ref(null);
const cropper: Ref<null | Cropper> = ref(null);
const uploadingIcon = ref(false);
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
  uploadingIcon.value = true;
  axios("/account/updateIcon", {
    method: "post",
    data: {
      file: base64url,
    },
  })
    .then(() => {
      window.message?.success("图片生效可能需要一段时间");
      showModal.value = false;
    })
    .finally(() => {
      uploadingIcon.value = false;
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
  showModal.value = true;
  nextTick(() => {
    cropImage();
  });
};
const handleCloseModal = function () {
  showModal.value = false;
};

/** 修改密码 */
const setPassword = reactive({
  oldPassword: "",
  newPassword: "",
  repeat: "",
});
const passwordRules: FormRules = {
  oldPassword: [
    {
      required: true,
      message: "不能为空",
      trigger: ["input", "blur"],
    },
  ],
  newPassword: [
    {
      required: true,
      validator(rule, value) {
        if (value === "") return new Error("请输入密码");
        else if (!matchRule("password", value))
          return new Error("密码必须为长度6~20的字母、数字和符号");
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
  repeat: [
    {
      required: true,
      validator(rule, value) {
        if (value === "") return new Error("请再次输入密码");
        else if (value !== setPassword.newPassword)
          return new Error("两次输入密码不一致");
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
};
const passwordForm: Ref<null | FormInst> = ref(null);
const handleUpdatePassword = function () {
  passwordForm.value?.validate((err) => {
    if (err) return;
    axios("/account/updatePassword", {
      method: "post",
      data: setPassword,
    }).then(() => {
      // location.href = "/login";
    });
  });
};

export default defineComponent({
  setup() {
    /** 用户信息 */
    const userInfo = inject(injection.userInfoKey)!;

    return {
      newIcon,
      cropIcon,
      showModal,
      iconUploader,
      uploadingIcon,
      userInfo,

      handleCloseModal,
      handleIconClick,
      handleIconChange,
      handleCropIcon,

      setPassword,
      passwordRules,
      passwordForm,
      handleUpdatePassword,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>