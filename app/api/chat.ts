import { ApiError, useHttp, unwrap, type Envelope, getToken } from './http'

export interface ConversationDTO {
  id: number
  name: string
  display_name: string
  avatar: string
  thread_id: string
  proactive_enabled: boolean
}

export interface MessageDTO {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface SendMessageReq {
  content: string
  agentId: string
  threadId: string
}

export interface UpdateProactiveReq {
  agentId: string
  enabled: boolean
}

export interface CreateThreadDTO {
  thread_id: string
}

export const useChatApi = () => {
  const { $api } = useHttp()

  const chatApi = {
    async getConversations(): Promise<ConversationDTO[]> {
      const resp = await $api<ConversationDTO[] | Envelope<ConversationDTO[]>>('/chatbox/queryConversations', {
        method: 'GET',
      })
      return unwrap(resp)
    },

    async getMessages(threadId: string): Promise<MessageDTO[]> {
      const resp = await $api<MessageDTO[] | Envelope<MessageDTO[]>>(`/chatbox/queryMessages/${encodeURIComponent(threadId)}`, {
        method: 'GET',
      })
      return unwrap(resp)
    },

    async createThread(agentName: string): Promise<CreateThreadDTO> {
      const resp = await $api<CreateThreadDTO | Envelope<CreateThreadDTO>>('/chatbox/createThread', {
        method: 'POST',
        body: { agentName },
      })
      return unwrap(resp)
    },

    async updateProactive(req: UpdateProactiveReq): Promise<void> {
      const resp = await $api<unknown>('/chatbox/proactive', {
        method: 'POST',
        body: req,
      })
      unwrap(resp)
    },

    /**
     * 流式发送消息，通过 onChunk 回调逐步返回内容
     */
    async sendMessage(
      data: SendMessageReq,
      onChunk: (chunk: string) => void,
    ): Promise<void> {
      const runtimeConfig = useRuntimeConfig()
      const baseURL = runtimeConfig.public.apiUrl ?? ''

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      const token = getToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const resp = await fetch(`${baseURL}/chatbox/sendMessage`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: data.content, agentId: data.agentId, threadId: data.threadId }),
      })

      if (!resp.ok) {
        let message = `HTTP ${resp.status}`
        let data: unknown
        try {
          data = await resp.clone().json()
          if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
            message = data.message
          }
        } catch {
          // 非 JSON 错误响应保留 HTTP 状态信息
        }
        throw new ApiError(message, resp.status, data)
      }
      if (!resp.body) {
        throw new ApiError('响应内容为空', resp.status)
      }

      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let eventData: string[] = []

      const dispatchEvent = () => {
        if (eventData.length === 0) return
        const chunk = eventData.join('\n')
        eventData = []

        if (!chunk || chunk === '[DONE]') return
        try {
          const evt = JSON.parse(chunk) as { type: string, content?: string }
          if (evt.type === 'text' && evt.content != null) {
            onChunk(evt.content)
          }
          // type: done / 其他类型忽略
        } catch {
          // 兼容纯文本格式
          onChunk(chunk)
        }
      }

      const processLine = (part: string) => {
        let line = part
        // 去除 CRLF 的 \r
        if (line.endsWith('\r')) line = line.slice(0, -1)

        // 跳过 SSE 控制行（event/id/retry/comment）
        if (/^(event|id|retry):/i.test(line) || line.startsWith(':')) return
        // 空行表示当前 SSE 事件结束
        if (line === '') {
          dispatchEvent()
          return
        }

        if (line.startsWith('data:')) {
          let chunk = line.slice(5)
          // SSE 规范：data: 后有一个可选空格
          if (chunk.startsWith(' ')) chunk = chunk.slice(1)
          eventData.push(chunk)
        } else {
          // 兼容非 SSE 的纯文本流
          onChunk(line)
        }
      }

      for (; ;) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        // 按行处理，保留不完整的行在 buffer 中
        const parts = buffer.split('\n')
        buffer = parts.pop() || ''

        for (const part of parts) processLine(part)
      }

      // 解码并处理最后一条未以换行符结尾的数据
      buffer += decoder.decode()
      if (buffer) processLine(buffer)
      dispatchEvent()
    },
  }

  return {
    chatApi,
  }
}
