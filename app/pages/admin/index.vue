<template>
  <div class="admin-page site-container">
    <section class="admin-shell" aria-labelledby="admin-title">
      <header class="admin-heading">
        <p class="eyebrow">ADMIN / 管理</p>
        <h1 id="admin-title">管理页面<span>。</span></h1>
        <p class="muted">查看站点用户及账户状态。</p>
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

      <v-card v-else-if="isAdmin" class="users-panel surface-card">
        <div class="users-toolbar">
          <div>
            <p class="eyebrow">USERS / 用户</p>
            <h2>用户列表</h2>
            <p class="muted">共 {{ pagination.total }} 位用户</p>
          </div>
          <v-btn to="/account" variant="text" color="secondary" prepend-icon="mdi-arrow-left">
            返回个人中心
          </v-btn>
        </div>

        <v-progress-linear
          v-if="usersLoading && users.length"
          indeterminate
          color="primary"
          height="3"
          aria-label="正在加载用户列表"
        />

        <div v-if="usersError" class="users-warning" role="alert">
          <v-icon icon="mdi-alert-circle-outline" size="20" aria-hidden="true" />
          <span>{{ usersError }}</span>
          <v-btn
            variant="text"
            color="secondary"
            size="small"
            prepend-icon="mdi-refresh"
            :loading="usersLoading"
            @click="loadUsers(pagination.page)"
          >
            重试
          </v-btn>
        </div>

        <div v-if="usersLoading && !users.length" class="users-state" aria-live="polite">
          <v-progress-circular indeterminate color="primary" size="34" width="3" />
          <div>
            <h3>正在加载用户</h3>
            <p class="muted">请稍候，我们正在获取用户列表。</p>
          </div>
        </div>

        <div v-else-if="!users.length && !usersError" class="users-state">
          <span class="state-icon" aria-hidden="true">
            <v-icon icon="mdi-account-search-outline" size="30" />
          </span>
          <div>
            <h3>暂无用户</h3>
            <p class="muted">当前没有可展示的用户记录。</p>
          </div>
        </div>

        <div v-else-if="users.length" class="users-table" :aria-busy="usersLoading">
          <div class="users-table-header" aria-hidden="true">
            <span>用户</span>
            <span>用户 ID</span>
            <span>角色</span>
            <span>状态</span>
            <span>最后登录</span>
          </div>

          <article v-for="user in users" :key="user.user_id" class="user-row">
            <div class="user-identity">
              <v-avatar size="44" color="surface-variant" class="user-avatar">
                <v-img v-if="assetUrl(user.avatar, 'icon')" :src="assetUrl(user.avatar, 'icon')" :alt="`${user.username} 的头像`" cover>
                  <template #error><v-icon icon="mdi-account-outline" size="24" /></template>
                </v-img>
                <v-icon v-else icon="mdi-account-outline" size="24" aria-hidden="true" />
              </v-avatar>
              <div>
                <strong>{{ user.nickname || user.username }}</strong>
                <span>@{{ user.username }}</span>
              </div>
            </div>

            <div class="user-field">
              <span class="user-field-label">用户 ID</span>
              <span class="user-id">{{ user.user_id }}</span>
            </div>

            <div class="user-field">
              <span class="user-field-label">角色</span>
              <v-chip
                :color="user.role === 'admin' ? 'primary' : undefined"
                size="small"
                variant="tonal"
              >
                {{ user.role === 'admin' ? '管理员' : '普通用户' }}
              </v-chip>
            </div>

            <div class="user-field">
              <span class="user-field-label">状态</span>
              <v-chip :color="user.is_active ? 'success' : 'error'" size="small" variant="tonal">
                {{ user.is_active ? '已启用' : '已停用' }}
              </v-chip>
            </div>

            <div class="user-field user-last-login">
              <span class="user-field-label">最后登录</span>
              <span>{{ formatLastLogin(user.last_login_time) }}</span>
            </div>
          </article>
        </div>

        <div v-if="pagination.total > PAGE_SIZE" class="users-pagination">
          <span>第 {{ pagination.page + 1 }} / {{ totalPages }} 页</span>
          <v-pagination
            :model-value="pagination.page + 1"
            :length="totalPages"
            :disabled="usersLoading"
            :total-visible="5"
            density="comfortable"
            rounded="circle"
            aria-label="用户列表分页"
            @update:model-value="handlePageChange"
          />
        </div>
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
import { isApiError, useAdminApi, type AdminPaginationDTO, type AdminUserDTO } from '@/api'
import { useAuthSession } from '@/composables/useAuthSession'
import { useAppStore } from '@/stores/app'

const PAGE_SIZE = 20
const USERS_ERROR = '暂时无法加载用户列表，请稍后重试。'

const appStore = useAppStore()
const { adminApi } = useAdminApi()
const { initializeAuth } = useAuthSession()
const { assetUrl } = useAssetUrl()

const users = ref<AdminUserDTO[]>([])
const usersLoading = ref(false)
const usersError = ref<string | null>(null)
const pagination = ref<AdminPaginationDTO>({
  page: 0,
  page_size: PAGE_SIZE,
  total: 0,
  has_more: false,
})

const isAuthLoading = computed(() => !appStore.authInitialized || appStore.userInfoLoading)
const isAdmin = computed(() => appStore.isLoggedIn && appStore.userInfo?.role === 'admin')
const totalPages = computed(() => Math.max(1, Math.ceil(pagination.value.total / pagination.value.page_size)))

useSeoMeta({ title: '管理页面 · Ivan1105' })

const formatLastLogin = (value: string | null) => {
  if (!value) return '从未登录'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const loadUsers = async (page: number) => {
  if (!isAdmin.value || usersLoading.value || !appStore.token) return

  const requestedToken = appStore.token
  usersLoading.value = true
  usersError.value = null

  try {
    const result = await adminApi.queryUsers(page, PAGE_SIZE)
    if (appStore.token !== requestedToken || !isAdmin.value) return

    users.value = result.users
    pagination.value = result.pagination
  } catch (error) {
    if (appStore.token !== requestedToken) return

    if (isApiError(error) && error.status === 401) {
      appStore.clearAuth()
      users.value = []
      return
    }

    usersError.value = isApiError(error) ? error.message : USERS_ERROR
    console.warn('[admin] queryUsers failed', error)
  } finally {
    usersLoading.value = false
  }
}

const handlePageChange = (page: number) => {
  const apiPage = page - 1
  if (apiPage === pagination.value.page || usersLoading.value) return
  void loadUsers(apiPage)
}

onMounted(async () => {
  await initializeAuth()
  if (isAdmin.value) {
    await loadUsers(0)
  }
})
</script>

<style scoped>
.admin-page {
  padding-block: 64px 88px;
}

.admin-shell {
  width: 100%;
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

.users-panel {
  overflow: hidden;
}

.users-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--site-space-3);
  padding: clamp(24px, 4vw, 36px);
  border-bottom: 1px solid var(--site-border);
}

.users-toolbar .eyebrow,
.users-toolbar h2,
.users-toolbar .muted {
  margin: 0;
}

.users-toolbar h2 {
  margin-top: 4px;
  color: var(--site-text);
  font-size: 1.5rem;
}

.users-toolbar .muted {
  margin-top: 4px;
  font-size: 0.9rem;
}

.users-warning {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: var(--site-space-3);
  padding: 12px 14px;
  border: 1px solid rgb(var(--v-theme-error) / 30%);
  border-radius: var(--site-radius);
  background: rgb(var(--v-theme-error) / 7%);
  color: var(--site-muted);
}

.users-warning span {
  flex: 1;
}

.users-state {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--site-space-3);
  padding: var(--site-space-4);
  text-align: left;
}

.users-state h3,
.users-state p {
  margin: 0;
}

.users-state h3 {
  color: var(--site-text);
  font-size: 1.25rem;
}

.users-state p {
  margin-top: 4px;
}

.users-table {
  opacity: 1;
  transition: opacity var(--site-transition);
}

.users-table[aria-busy="true"] {
  opacity: 0.65;
}

.users-table-header,
.user-row {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) 100px 120px 110px minmax(170px, 0.7fr);
  align-items: center;
  gap: var(--site-space-2);
  padding-inline: clamp(24px, 4vw, 36px);
}

.users-table-header {
  min-height: 48px;
  color: var(--site-muted);
  background: var(--site-soft);
  font-size: 0.75rem;
  font-weight: 700;
}

.user-row {
  min-height: 82px;
  border-bottom: 1px solid var(--site-border);
}

.user-identity {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  flex: 0 0 auto;
  color: var(--site-accent);
}

.user-identity > div {
  min-width: 0;
  display: grid;
}

.user-identity strong,
.user-identity span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-identity strong {
  color: var(--site-text);
}

.user-identity span,
.user-last-login,
.user-id {
  color: var(--site-muted);
  font-size: 0.85rem;
}

.user-field {
  min-width: 0;
}

.user-field-label {
  display: none;
}

.users-pagination {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--site-space-3);
  padding: 12px clamp(24px, 4vw, 36px);
  color: var(--site-muted);
  font-size: 0.85rem;
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

  .users-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .users-toolbar .v-btn {
    align-self: flex-start;
  }

  .users-warning {
    align-items: flex-start;
    flex-wrap: wrap;
    margin: var(--site-space-2);
  }

  .users-warning .v-btn {
    margin-left: 26px;
  }

  .users-state {
    min-height: 260px;
    align-items: flex-start;
    flex-direction: column;
  }

  .users-table-header {
    display: none;
  }

  .user-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: var(--site-space-2);
    padding-block: var(--site-space-3);
  }

  .user-identity {
    grid-column: 1 / -1;
  }

  .user-field {
    display: grid;
    align-content: start;
    gap: 5px;
  }

  .user-field .v-chip {
    justify-self: start;
  }

  .user-field-label {
    display: block;
    color: var(--site-muted);
    font-size: 0.72rem;
    font-weight: 700;
  }

  .user-last-login {
    grid-column: 1 / -1;
  }

  .users-pagination {
    align-items: stretch;
    flex-direction: column;
  }

  .users-pagination > span {
    text-align: center;
  }

  .admin-state .v-btn {
    width: 100%;
  }
}
</style>
