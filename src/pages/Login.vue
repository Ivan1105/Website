<template>
    <div class="container">
        <transition name="form-switch">
            <v-form v-if="formType === 'signin'" class="form login">
                <h2>SIGN IN</h2>
                <v-text-field label="用户名" prepend-inner-icon="mdi-account" name="username" />
                <v-text-field label="密码" prepend-inner-icon="mdi-key" name="password" type="password" />
                <v-checkbox label="下次自动登录" color="primary" />
                <v-btn size="large" block rounded>登录</v-btn>
                <v-btn class="mt-5" color="#fff" size="large" block rounded
                    @click="changeFormType('signup')">前往注册</v-btn>
            </v-form>
            <v-form v-else-if="formType === 'signup'" class="form signup">
                <h2>SIGN UP</h2>
                <v-text-field label="用户名" prepend-inner-icon="mdi-account" name="username" />
                <v-text-field label="密码" prepend-inner-icon="mdi-key" name="password" type="password" />
                <v-checkbox label="下次自动登录" color="primary" />
                <v-btn size="large" block rounded>登录</v-btn>
                <v-btn class="mt-5" color="#fff" size="large" block rounded
                    @click="changeFormType('signin')">前往注册</v-btn>
            </v-form>
        </transition>
    </div>
</template>

<script lang="ts" setup>
type FormType = 'signin' | 'signup';
const formType = ref<FormType>('signin');
const changeFormType = function (val: FormType) {
    formType.value = val;
}
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    background-image: url(https://oss.ivan1105.top/static/login-bg.jpg);
    background-size: cover;
    background-position: 30% 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2em 0.3em;
}

.form {
    width: 600px;
    max-width: 100%;
    padding: 2em;
    border-radius: 10px;
    background-color: rgba(var(--v-theme-background), .5);
    backdrop-filter: blur(8px);
    box-shadow: 0 0 30px 10px #0000004d;
    position: relative;
}

h2 {
    margin-bottom: 1em;
    text-align: center;
    text-transform: uppercase;
}

.form-switch-enter-active,
.form-switch-leave-active {
    transition: all 0.5s;
    position: absolute
}

.login.form-switch-enter-from,
.login.form-switch-leave-to {
    transform: translate(-100%) rotate(-67deg);
    opacity: 0
}

.signup.form-switch-leave-to,
.signup.form-switch-enter-from {
    transform: translate(100%) rotate(67deg);
    opacity: 0
}

.captcha-enter-active,
.captcha-leave-active {
    transition: all 0.3s
}

.captcha-enter-from,
.captcha-leave-to {
    transform: translateY(-100%);
    opacity: 0
}
</style>