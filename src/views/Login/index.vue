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
        <ivan-input
          v-model="loginInfo.username"
          class="item"
          placeholder="username"
        />
        <ivan-input
          v-model="loginInfo.password"
          class="item"
          placeholder="password"
        />

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
        <ivan-input
          class="item"
          placeholder="username"
          v-model="registerInfo.username"
          :validator="registerValidators.username"
        />
        <ivan-input
          class="item"
          placeholder="password"
          v-model="registerInfo.password"
          :validator="registerValidators.password"
        />
        <ivan-input
          class="item"
          placeholder="repeat password"
          v-model="registerInfo.repeat"
          :validator="registerValidators.repeat"
        />
        <ivan-input
          class="item"
          placeholder="email"
          v-model="registerInfo.email"
          :validator="registerValidators.email"
        >
          <template #right> 发送验证码 </template>
        </ivan-input>
        <ivan-input
          class="item"
          placeholder="captcha"
          v-model="registerInfo.captcha"
        />
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
import { matchRule } from "@/utils";
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  Ref,
  ref,
} from "@vue/runtime-core";
import IvanInput from "./components/Input/index.vue";

/** 登录信息 */
let loginInfo = reactive({
  username: "",
  password: "",
});
/** 注册信息 */
let registerInfo = reactive({
  username: "",
  password: "",
  repeat: "",
  email: "",
  captcha: "",
});
/** 注册信息验证 */
let registerValidators = computed(() => {
  return {
    username: matchRule("username", registerInfo.username)
      ? ""
      : "用户名必须为长度4~20的字母和数字",
    password: matchRule("password", registerInfo.password)
      ? ""
      : "密码必须为长度6~20的字母、数字和符号",
    repeat:
      registerInfo.password === registerInfo.repeat ? "" : "两次输入密码不一致",
    email: matchRule("email", registerInfo.email) ? "" : "无法识别的邮箱格式",
  };
});

export default defineComponent({
  components: { IvanInput },
  setup() {
    let hideLogin = ref(false);
    let hideRegister = ref(true);
    let loginForm: Ref<null | HTMLFormElement> = ref(null);
    let registerForm: Ref<null | HTMLFormElement> = ref(null);
    /** 切换功能 */
    function switchTo(type: "login" | "register") {
      if (type === "login") {
        hideRegister.value = true;
        loginForm.value!.style.display = "";
      } else {
        hideLogin.value = true;
        registerForm.value!.style.display = "";
      }
    }
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
      IvanInput,
      loginInfo,
      registerValidators,
      registerInfo,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>