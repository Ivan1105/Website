<template>
  <div class="login-page site-container">
    <section class="login-shell" aria-labelledby="login-title">
      <div class="login-intro">
        <p class="eyebrow">YOUR PERSONAL SPACE</p>
        <h1>欢迎回来，<br>继续灵感的旅程<span>。</span></h1>
        <p class="muted">在熟悉的空间里，<br>让每一次交流，都成为新的开始。</p>
        <SignalArtwork class="login-artwork" />
      </div>
      <v-card class="login-card surface-card">
        <div class="login-header">
          <span class="login-icon" aria-hidden="true"><v-icon icon="mdi-account-outline" size="26" /></span>
          <p class="eyebrow">ACCOUNT / 账户</p>
          <h2 id="login-title">登录个人空间</h2>
          <p class="muted">输入你的账户信息，继续对话。</p>
        </div>
        <v-form ref="formRef" v-model="valid" @submit.prevent="handleLogin">
          <div class="field-group">
            <label class="field-label" for="login-username">用户名</label>
            <v-text-field id="login-username" v-model="form.username" placeholder="请输入用户名"
              hide-details="auto" :rules="usernameRules" prepend-inner-icon="mdi-account-outline"
              autocomplete="username" :disabled="loading" />
          </div>
          <div class="field-group">
            <label class="field-label" for="login-password">密码</label>
            <v-text-field id="login-password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码" hide-details="auto" :rules="passwordRules"
              prepend-inner-icon="mdi-lock-outline" autocomplete="current-password" :disabled="loading">
              <template #append-inner>
                <v-btn :icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" variant="text"
                  :aria-label="showPassword ? '隐藏密码' : '显示密码'" :aria-pressed="showPassword"
                  :disabled="loading" width="44" height="44" @click="showPassword = !showPassword" />
              </template>
            </v-text-field>
          </div>
          <v-btn type="submit" size="large" variant="flat" :loading="loading" :disabled="loading"
            class="login-btn" color="primary" append-icon="mdi-arrow-right" block>登录</v-btn>
          <p class="login-progress" role="status">{{ loading ? '正在登录，请稍候…' : '' }}</p>
        </v-form>
        <nuxt-link to="/" class="back-home"><v-icon icon="mdi-arrow-left" size="16" /> 返回首页</nuxt-link>
      </v-card>
    </section>
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" class="site-snackbar" location="bottom">
      <span role="alert"><v-icon icon="mdi-alert-circle-outline" size="18" /> {{ snackbar.text }}</span>
      <template #actions><v-btn variant="text" @click="snackbar.show = false">关闭</v-btn></template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useUserApi } from '@/api'
import { useAuthSession } from '@/composables/useAuthSession'
import { useAppStore } from '@/stores/app'

const { userApi } = useUserApi()
const appStore = useAppStore()
const { refreshUserInfo } = useAuthSession()

useSeoMeta({ title: '登录 · Ivan1105' })

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const valid = ref(true)
const loading = ref(false)
const showPassword = ref(false)

const snackbar = reactive({
  show: false,
  text: '',
  timeout: 6000,
})

const showError = (text: string) => {
  snackbar.text = text
  snackbar.show = true
}

const form = reactive({
  username: '',
  password: '',
})

const usernameRules = [
  (v: string) => !!v?.trim() || '请输入用户名',
]

const passwordRules = [
  (v: string) => !!v?.trim() || '请输入密码',
]

const handleLogin = async () => {
  if (loading.value) return
  const { valid: formValid } = await formRef.value?.validate?.() ?? { valid: false }
  if (!formValid) return

  loading.value = true
  try {
    const token = await userApi.login({
      username: form.username.trim(),
      password: form.password,
    })
    appStore.setToken(token)
    await refreshUserInfo()
    await navigateTo('/account')
  } catch (e) {
    showError(e instanceof Error ? e.message : '登录失败，请检查用户名或密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  padding-block: 56px;
}

.login-shell {
  width: min(980px, 100%);
  min-height: calc(100dvh - var(--site-nav-height) - 112px);
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 420px;
  align-items: center;
  gap: 72px;
}

.login-intro > .eyebrow {
  margin-bottom: 22px;
}

.login-intro h1 {
  font-size: clamp(2rem, 3.7vw, 3.25rem);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.035em;
}

.login-intro h1 span {
  color: var(--site-accent);
}

.login-intro > p.muted {
  margin-top: 18px;
  font-size: 0.95rem;
  line-height: 1.9;
}

.login-intro .login-artwork {
  width: 290px;
  margin: 24px 0 0 12px;
}

.login-card {
  padding: 38px;
}

.login-header {
  margin-bottom: 28px;
}

.login-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: var(--site-soft);
  color: var(--site-accent);
  margin-bottom: var(--site-space-3);
}

.login-header .eyebrow {
  font-size: 0.65rem;
}

.login-header h2 {
  font-size: 1.65rem;
  margin: 8px 0;
}

.login-header > .muted {
  font-size: 0.85rem;
}

.field-group {
  margin-bottom: 22px;
}

.field-label {
  display: block;
  margin-bottom: var(--site-space-1);
  font-size: 0.88rem;
  font-weight: 600;
}

.login-btn {
  margin-top: 6px;
  height: 48px;
}

.login-progress {
  min-height: 28px;
  font-size: 0.8rem;
  color: var(--site-muted);
  margin-top: var(--site-space-1);
}

.back-home {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--site-space-1);
  min-height: 44px;
  text-decoration: none;
  font-size: 0.85rem;
}

@media (max-width: 960px) {
  .login-shell {
    grid-template-columns: 1fr 380px;
    gap: var(--site-space-4);
  }
  .login-card {
    padding: 30px;
  }
}

@media (max-width: 760px) {
  .login-page {
    padding-block: var(--site-space-4);
  }
  .login-shell {
    grid-template-columns: 1fr;
    max-width: 440px;
    gap: var(--site-space-3);
    min-height: auto;
  }
  .login-intro h1 {
    font-size: 1.6rem;
  }
  .login-intro h1 br {
    display: none;
  }
  .login-intro > .eyebrow {
    margin-bottom: 10px;
    font-size: 0.65rem;
  }
  .login-intro > p.muted, .login-artwork {
    display: none;
  }
  .login-card {
    padding: 28px 24px;
  }
}
</style>
