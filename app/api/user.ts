import { useHttp, unwrap, type Envelope } from './http'

export interface LoginReq {
  username: string
  password: string
}

export interface LoginResp {
  code: number
  data: string
  message?: string
}

export interface UserInfoDTO {
  username: string
  user_id: number
  nickname: string | null
  avatar?: string | null
}

export const useUserApi = () => {
  const { $api } = useHttp()

  const userApi = {
    /**
     * 登录接口：POST /login
     * 传参 { username, password }
     * 返回 { code: 0, data: string }，data 为 token
     */
    async login(req: LoginReq): Promise<string> {
      const resp = await $api<LoginResp>('/userinfo/login', {
        method: 'POST',
        body: req,
      })
      if (resp.code === 0 || resp.code === 200) {
        return resp.data
      }
      throw new Error(resp.message ?? '登录失败')
    },

    /**
     * 获取当前用户信息：GET /userinfo/queryUserInfo
     * 返回 { username, user_id, nickname, avatar? } | null（未登录时为 null）
     */
    async queryUserInfo(): Promise<UserInfoDTO | null> {
      const resp = await $api<UserInfoDTO | null | Envelope<UserInfoDTO | null>>('/userinfo/queryUserInfo', {
        method: 'GET',
      })
      return unwrap(resp)
    },
  }

  return {
    userApi,
  }
}
