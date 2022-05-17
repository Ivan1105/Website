<template>
  <div class="login-body">
    <form
      :class="{
        'form-container': true,
        'login-form': true,
        hidden: hideLogin,
      }"
      ref="loginForm"
      @submit.prevent
    >
      <h2 class="form-header">LOGIN</h2>
      <div class="form-items">
        <div class="item input-item">
          <input type="text" placeholder="USERNAME" />
        </div>
        <div class="item input-item">
          <input type="text" placeholder="PASSWORD" />
        </div>
        <div class="item options-item">
          <n-checkbox>保持登录</n-checkbox>
          <n-button text>忘记密码</n-button>
        </div>
      </div>
      <div class="form-actions">
        <button class="form-action">登录</button>
      </div>
      <div class="form-footer">
        <n-button text @click="switchTo('register')">注册一个新账号</n-button>
      </div>
    </form>

    <form
      :class="{
        'form-container': true,
        'register-form': true,
        hidden: hideRegister,
      }"
      ref="registerForm"
      @submit.prevent
    >
      <h2 class="form-header">REGISTER</h2>
      <div class="form-items">
        <div class="item input-item">
          <input type="text" placeholder="USERNAME" />
        </div>
        <div class="item input-item">
          <input type="text" placeholder="PASSWORD" />
        </div>
        <div class="item input-item">
          <input type="text" placeholder="REPEAT PASSWORD" />
        </div>
        <div class="item input-item">
          <input type="text" class="left" placeholder="EMAIL" />
          <button class="slot-right">发送验证码</button>
        </div>
        <div class="item input-item">
          <input type="text" placeholder="CAPTCHA" />
        </div>
      </div>
      <div class="form-actions">
        <button class="form-action">注册</button>
      </div>
      <div class="form-footer">
        <n-button text @click="switchTo('login')">返回登录</n-button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "@vue/runtime-core";

let hideLogin = ref(true);
let hideRegister = ref(false);
let loginForm: Ref<null | HTMLFormElement> = ref(null);
let registerForm: Ref<null | HTMLFormElement> = ref(null);

function switchTo(type: "login" | "register") {
  if (type === "login") {
    hideRegister.value = true;
    loginForm.value!.style.display = "";
  } else {
    hideLogin.value = true;
    registerForm.value!.style.display = "";
  }
}

export default defineComponent({
  setup() {
    onMounted(() => {
      loginForm.value!.ontransitionend = function (ev: any) {
        if (ev.target !== loginForm.value) return;
        if (loginForm.value?.classList.contains("hidden")) {
          hideRegister.value = false;
          loginForm.value.style.display = "none";
        }
      };
      registerForm.value!.ontransitionend = function (ev: any) {
        if (ev.target !== registerForm.value) return;
        if (registerForm.value?.classList.contains("hidden")) {
          hideLogin.value = false;
          registerForm.value.style.display = "none";
        }
      };
    });

    return {
      switchTo,
      hideLogin,
      hideRegister,
      loginForm,
      registerForm,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>