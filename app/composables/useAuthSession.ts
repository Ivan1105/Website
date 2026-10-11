import { isApiError, useUserApi } from '@/api'
import { useAppStore } from '@/stores/app'

const USER_INFO_ERROR = '暂时无法加载账户信息，请稍后重试。'
let refreshingToken: string | null = null

export const useAuthSession = () => {
  const appStore = useAppStore()
  const { userApi } = useUserApi()

  const refreshUserInfo = async () => {
    if (!appStore.token) {
      appStore.clearUserInfo()
      appStore.setUserInfoError(null)
      return null
    }

    const requestedToken = appStore.token
    if (appStore.userInfoLoading && refreshingToken === requestedToken) return appStore.userInfo

    refreshingToken = requestedToken
    appStore.setUserInfoLoading(true)
    appStore.setUserInfoError(null)

    try {
      const info = await userApi.queryUserInfo()
      if (appStore.token !== requestedToken) return null
      if (!info) {
        appStore.clearAuth()
        return null
      }
      appStore.setUserInfo(info)
      return info
    } catch (error) {
      if (appStore.token !== requestedToken) return null
      if (isApiError(error) && error.status === 401) {
        appStore.clearAuth()
        return null
      }

      appStore.setUserInfoError(USER_INFO_ERROR)
      console.warn('[auth] queryUserInfo failed', error)
      return appStore.userInfo
    } finally {
      if (refreshingToken === requestedToken) {
        refreshingToken = null
        appStore.setUserInfoLoading(false)
      }
    }
  }

  const initializeAuth = async () => {
    if (!appStore.authInitialized) {
      appStore.initFromStorage()
    }
    if (!appStore.token) return null
    return refreshUserInfo()
  }

  return {
    initializeAuth,
    refreshUserInfo,
  }
}
