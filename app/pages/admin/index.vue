<template>
  <div class="admin-page site-container">
    <section class="admin-shell" aria-labelledby="admin-title">
      <header class="admin-heading">
        <p class="eyebrow">ADMIN / 管理</p>
        <h1 id="admin-title">管理页面<span>。</span></h1>
        <p class="muted">站点管理功能将在这里提供。</p>
      </header>

      <v-card
        v-if="isAuthLoading"
        class="admin-card surface-card admin-state"
        aria-live="polite"
      >
        <v-progress-circular indeterminate color="primary" size="34" width="3" />
        <div>
          <h2>正在确认访问权限</h2>
          <p class="muted">请稍候，我们正在获取你的账户信息。</p>
        </div>
      </v-card>

      <v-card v-else-if="isAdmin" class="admin-card surface-card admin-state">
        <span class="state-icon" aria-hidden="true">
          <v-icon icon="mdi-view-dashboard-outline" size="32" />
        </span>
        <div>
          <p class="eyebrow">COMING SOON</p>
          <h2>管理功能正在建设中</h2>
          <p class="muted">当前页面仅作为管理入口占位，暂未开放具体操作。</p>
        </div>
        <v-btn to="/account" color="primary" size="large" prepend-icon="mdi-arrow-left">
          返回个人中心
        </v-btn>
      </v-card>

      <v-card v-else class="admin-card surface-card admin-state" role="alert">
        <span class="state-icon state-icon-error" aria-hidden="true">
          <v-icon icon="mdi-shield-lock-outline" size="32" />
        </span>
        <div>
          <p class="eyebrow">ACCESS DENIED</p>
          <h2>无权访问管理页面</h2>
          <p class="muted">此页面仅限管理员访问。</p>
        </div>
        <v-btn to="/account" color="primary" size="large" prepend-icon="mdi-arrow-left">
          返回个人中心
        </v-btn>
      </v-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthSession } from '@/composables/useAuthSession'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const { initializeAuth } = useAuthSession()

const isAuthLoading = computed(() => !appStore.authInitialized || appStore.userInfoLoading)
const isAdmin = computed(() => appStore.isLoggedIn && appStore.userInfo?.role === 'admin')

useSeoMeta({ title: '管理页面 · Ivan1105' })

onMounted(async () => {
  await initializeAuth()
})
</script>

<style scoped>
.admin-page {
  padding-block: 64px 88px;
}

.admin-shell {
  width: min(760px, 100%);
  min-height: calc(100dvh - var(--site-nav-height) - 152px);
  margin-inline: auto;
}

.admin-heading {
  display: flow-root;
  margin-bottom: var(--site-space-4);
}

.admin-heading .eyebrow {
  margin: 0;
}

.admin-heading h1 {
  margin: 10px 0 0;
  font-size: clamp(2.15rem, 5vw, 3.5rem);
  font-weight: 550;
  line-height: 1.2;
  letter-spacing: -0.045em;
}

.admin-heading h1 span {
  color: var(--site-accent);
}

.admin-heading .muted {
  margin: 12px 0 0;
}

.admin-card {
  padding: clamp(24px, 5vw, 44px);
}

.admin-state {
  min-height: 310px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--site-space-3);
}

.admin-state h2 {
  margin-top: 6px;
  color: var(--site-text);
  font-size: clamp(1.4rem, 3vw, 1.9rem);
}

.admin-state .muted {
  margin-top: 8px;
}

.state-icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: var(--site-soft);
  color: var(--site-accent);
}

.state-icon-error {
  background: rgb(var(--v-theme-error) / 10%);
  color: rgb(var(--v-theme-error));
}

@media (max-width: 600px) {
  .admin-page {
    padding-block: 40px 64px;
  }

  .admin-heading {
    margin-bottom: var(--site-space-3);
  }

  .admin-state .v-btn {
    width: 100%;
  }
}
</style>
