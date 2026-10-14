import { useHttp, unwrap, type Envelope } from './http'
import type { UserRole } from './user'

export interface AdminUserDTO {
  user_id: number
  username: string
  nickname: string | null
  avatar: string | null
  last_login_time: string | null
  is_active: boolean
  role: UserRole
}

export interface AdminPaginationDTO {
  page: number
  page_size: number
  total: number
  has_more: boolean
}

export interface QueryUsersDTO {
  users: AdminUserDTO[]
  pagination: AdminPaginationDTO
}

export interface ResetPasswordDTO {
  user_id: number
  temporary_password: string
}

export interface UpdateActiveReq {
  active: boolean
}

export const useAdminApi = () => {
  const { $api } = useHttp()

  const adminApi = {
    async queryUsers(page = 0, pageSize = 20): Promise<QueryUsersDTO> {
      const resp = await $api<QueryUsersDTO | Envelope<QueryUsersDTO>>('/admin/queryUsers', {
        method: 'GET',
        query: {
          page,
          page_size: pageSize,
        },
      })
      return unwrap(resp)
    },

    async resetPassword(userId: number): Promise<ResetPasswordDTO> {
      const resp = await $api<ResetPasswordDTO | Envelope<ResetPasswordDTO>>(`/admin/resetPassword/${encodeURIComponent(userId)}`, {
        method: 'POST',
      })
      return unwrap(resp)
    },

    async updateActive(userId: number, req: UpdateActiveReq): Promise<void> {
      const resp = await $api<unknown | Envelope<unknown>>(`/admin/updateActive/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        body: req,
      })
      unwrap(resp)
    },
  }

  return { adminApi }
}
