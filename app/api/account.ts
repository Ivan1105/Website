import { useHttp, unwrap, type Envelope } from './http'

export interface AccountInfoDTO {
  user_id: number
  username: string
  nickname: string | null
  email: string | null
  signature: string | null
  avatar: string | null
  banner: string | null
}

export interface UpdateAccountInfoReq {
  nickname?: string
  email?: string
  password?: string
  currentPassword?: string
  signature?: string
  avatar?: string
  banner?: string
}

export const useAccountApi = () => {
  const { $api } = useHttp()

  const accountApi = {
    async queryAccountInfo(): Promise<AccountInfoDTO | null> {
      const resp = await $api<AccountInfoDTO | null | Envelope<AccountInfoDTO | null>>('/account/queryAccountInfo', {
        method: 'GET',
      })
      return unwrap(resp)
    },

    async updateAccountInfo(req: UpdateAccountInfoReq): Promise<AccountInfoDTO> {
      const resp = await $api<AccountInfoDTO | Envelope<AccountInfoDTO>>('/account/updateAccountInfo', {
        method: 'PUT',
        body: req,
      })
      return unwrap(resp)
    },
  }

  return { accountApi }
}
