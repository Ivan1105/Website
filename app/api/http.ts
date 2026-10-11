import { ofetch, type $Fetch, type FetchContext } from 'ofetch'

export interface Envelope<T> {
  code: number
  data: T
  message?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function isEnvelope(value: unknown): value is Envelope<unknown> {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  return 'code' in obj && 'data' in obj
}

/**
 * 解包后端统一响应：{ code, data, message }
 * - code 为 0 / 200 时返回 data
 * - 否则抛出带 code 的 ApiError
 * - 非包格式原样返回
 */
export function unwrap<T>(body: T | Envelope<T>): T {
  if (isEnvelope(body)) {
    if (body.code === 0 || body.code === 200) {
      return body.data as T
    }
    throw new ApiError(body.message ?? 'Request failed', body.code, body)
  }
  return body
}

const TOKEN_KEY = 'token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

/**
 * 创建带统一配置的 ofetch 实例：
 * - 注入 baseURL / timeout
 * - 自动注入 Authorization: Bearer <token>
 * - 统一错误日志
 */
export const useHttp = (): { $api: $Fetch } => {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.public.apiUrl ?? '/'

  const $api = ofetch.create({
    baseURL,
    timeout: 60000,
    async onRequest({ options }) {
      const token = getToken()
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        } as any
      }
    },
    async onResponseError(ctx: FetchContext) {
      const { response } = ctx
      const status = response?.status ?? 0
      const data = response?._data
      const message = data?.message ?? ctx.error?.message ?? `HTTP ${status}`
      console.error('[API Error]', status, message)
      throw new ApiError(message, status, data)
    },
  })

  return { $api }
}
