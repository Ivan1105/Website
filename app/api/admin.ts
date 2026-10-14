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
  }

  return { adminApi }
}
