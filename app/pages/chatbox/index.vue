<template>
  <div class="chatbox-page">
    <div class="chat-page-heading">
      <div><p class="eyebrow">A SPACE FOR IDEAS</p><h1>让对话，带来新灵感。</h1></div>
      <p class="muted">从一个问题开始。</p>
    </div>
    <div class="chatbox-container">
      <aside class="desktop-conversations surface-card" aria-label="会话列表">
        <ConversationList :conversations="conversations" :selected="currentConversationId" :pending="conversationsLoading"
          :error="conversationsError" :disabled="conversationSelectionDisabled" @select="selectConversation" />
      </aside>
      <section class="chat-area surface-card" aria-label="聊天">
        <header class="chat-header">
          <v-dialog v-model="drawerOpen" class="conversation-drawer" content-class="conversation-drawer-content"
            aria-label="会话列表" transition="slide-x-transition" max-width="340">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon="mdi-menu" variant="text" class="mobile-conversations-toggle" aria-label="打开会话列表" />
            </template>
            <v-card class="drawer-card">
              <ConversationList :conversations="conversations" :selected="currentConversationId" :pending="conversationsLoading"
                :error="conversationsError" :disabled="conversationSelectionDisabled" @select="selectConversation">
                <template #actions><v-btn icon="mdi-close" variant="text" aria-label="关闭会话列表" @click="drawerOpen = false" /></template>
              </ConversationList>
            </v-card>
          </v-dialog>
          <v-avatar color="surface-variant" size="42" class="header-avatar">
            <v-img v-if="currentConversation?.avatar" :src="assetUrl(currentConversation.avatar)" alt="" cover><template #error><v-icon icon="mdi-chat-outline" /></template></v-img>
            <v-icon v-else icon="mdi-chat-outline" color="secondary" />
          </v-avatar>
          <div class="chat-header-text">
            <h2>{{ currentConversation?.display_name || '聊天空间' }}</h2>
            <p>{{ currentConversation ? '把你的想法，写在这里。' : '选择一个会话，开始交流。' }}</p>
          </div>
          <v-menu v-if="currentConversation && !authRequired" v-model="settingsMenuOpen" location="bottom end"
            :close-on-content-click="false" offset="8">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon="mdi-cog-outline" variant="text" color="secondary" size="small"
                class="chat-settings-trigger" :disabled="conversationSelectionDisabled" aria-label="打开设置" />
            </template>
            <v-list class="chat-settings-menu" density="compact" aria-label="聊天设置">
              <v-list-item class="chat-setting-item settings-toggle-item" prepend-icon="mdi-bell-outline">
                <v-list-item-title>主动提醒功能</v-list-item-title>
                <v-list-item-subtitle class="chat-setting-description">
                  开启后，{{ currentConversation.display_name }}会在合适的时候主动来找你。
                </v-list-item-subtitle>
                <template #append>
                  <v-switch :model-value="currentConversation?.proactive_enabled ?? false" color="secondary"
                    density="compact" hide-details :loading="proactiveUpdating" :disabled="proactiveUpdating"
                    aria-label="主动提醒功能" @click.stop @update:model-value="updateProactiveReminder" />
                </template>
              </v-list-item>
              <v-list-item class="chat-setting-item settings-toggle-item" prepend-icon="mdi-book-open-page-variant-outline">
                <v-list-item-title>自动记录日记</v-list-item-title>
                <v-list-item-subtitle class="chat-setting-description">
                  开启后，{{ currentConversation.display_name }}会每天写下与你共度的时光。
                </v-list-item-subtitle>
                <template #append>
                  <v-switch :model-value="currentConversation?.journal_enabled ?? false" color="secondary"
                    density="compact" hide-details :loading="journalUpdating" :disabled="journalUpdating"
                    aria-label="自动记录日记" @click.stop @update:model-value="updateJournal" />
                </template>
              </v-list-item>
              <v-divider />
              <v-list-item class="chat-setting-item" prepend-icon="mdi-chat-plus-outline" :disabled="conversationSelectionDisabled"
                @click="openClearContextDialog">
                <v-list-item-title>新建会话</v-list-item-title>
                <v-list-item-subtitle class="chat-setting-description">
                  开始一段新的对话，已有记忆会继续保留。
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-menu>
        </header>
        <div ref="messagesAreaRef" class="messages-area" tabindex="0" aria-label="消息记录" :aria-busy="loading || sending">
          <div v-if="conversationsLoading || loading" class="chat-state" role="status">
            <v-progress-circular indeterminate color="secondary" size="28" width="2" /><p>正在加载{{ conversationsLoading ? '会话' : '消息' }}…</p>
          </div>
          <div v-else-if="authRequired || conversationsError || messagesError" class="chat-state" role="status">
            <span class="state-icon"><v-icon icon="mdi-alert-circle-outline" color="error" size="30" /></span>
            <h3>{{ authRequired ? '需要重新登录' : '暂时无法加载' }}</h3><p>{{ authRequired ? authErrorMessage : (conversationsError || messagesError) }}</p><p v-if="!authRequired">请稍后刷新页面再试。</p>
            <v-btn v-if="authRequired || !appStore.isLoggedIn" to="/login" variant="text" color="secondary" append-icon="mdi-arrow-right">前往登录</v-btn>
          </div>
          <div v-else-if="!currentConversation" class="chat-state">
            <span class="state-icon"><v-icon icon="mdi-chat-outline" size="32" /></span>
            <p class="eyebrow">A NEW CONVERSATION</p><h3>对话，从这里开始</h3>
            <p>暂无可用会话。{{ appStore.isLoggedIn ? '请稍后再来看看。' : '可以先登录你的账户。' }}</p>
            <v-btn v-if="!appStore.isLoggedIn" to="/login" color="primary" append-icon="mdi-arrow-right">前往登录</v-btn>
          </div>
          <div v-else-if="!currentMessages.length" class="chat-state">
            <span class="state-icon"><v-icon icon="mdi-forum-outline" size="32" /></span>
            <p class="eyebrow">A LITTLE INSPIRATION</p><h3>今天，想聊些什么？</h3><p>分享一个想法，或提出你的第一个问题。</p>
          </div>
          <template v-else>
            <div v-if="messagesHasMore || loadingMore" v-intersect="onHistoryIntersect" class="history-loader"
              role="status" :aria-label="historyLoaderLabel">
              <template v-if="loadingMore">
                <v-progress-circular indeterminate color="secondary" size="18" width="2" />
                <span>正在加载更早的消息…</span>
              </template>
              <v-btn v-else-if="historyLoadError" variant="text" color="secondary" size="small"
                prepend-icon="mdi-refresh" @click="loadOlderMessages">加载失败，点击重试</v-btn>
              <template v-else>
                <v-icon icon="mdi-history" size="18" />
                <span>继续向上查看更早的消息</span>
              </template>
            </div>
            <article v-for="msg in currentMessages" :key="msg.key" class="message-row"
              :class="{ 'message-self': msg.role === 'user', 'message-signal': msg.role === 'signal' || msg.role === 'stream-error' }"
              :aria-label="msg.role === 'user' ? '我的消息' : msg.role === 'signal' ? '系统提醒' : msg.role === 'stream-error' ? '回复错误' : '回复'">
              <div v-if="msg.role === 'signal'" class="signal-message">
                <span>触发系统提醒</span>
                <span aria-hidden="true">·</span>
                <time :datetime="msg.createdAt">{{ formatTime(msg.createdAt) }}</time>
              </div>
              <div v-else-if="msg.role === 'stream-error'" class="signal-message stream-error-message">
                <span>连接失败</span>
                <span aria-hidden="true">·</span>
                <time :datetime="msg.createdAt">{{ formatTime(msg.createdAt) }}</time>
              </div>
              <template v-else>
                <v-avatar color="surface-variant" size="32" class="message-avatar" aria-hidden="true">
                  <v-img v-if="msg.role === 'user' && appStore.userInfo?.avatar" :src="assetUrl(appStore.userInfo.avatar)" alt="" cover>
                    <template #error><v-icon icon="mdi-account-outline" size="18" /></template>
                  </v-img>
                  <v-img v-else-if="currentConversation?.avatar" :src="assetUrl(currentConversation.avatar)" alt="" cover>
                    <template #error><v-icon icon="mdi-chat-outline" size="18" color="secondary" /></template>
                  </v-img>
                  <v-icon v-else :icon="msg.role === 'user' ? 'mdi-account-outline' : 'mdi-chat-outline'" size="18"
                    :color="msg.role === 'user' ? undefined : 'secondary'" />
                </v-avatar>
                <div class="message-bubble-wrapper">
                  <span class="message-author">{{ msg.role === 'user' ? '我' : currentConversation?.display_name }}</span>
                  <div class="message-bubble" :class="msg.role === 'user' ? 'bubble-self' : 'bubble-other'">
                    <div v-if="msg.loading && !msg.content && !msg.toolCalls?.length" class="reply-loading" role="status"><v-progress-circular indeterminate size="18" width="2" color="secondary" /> 正在回复…</div>
                    <p v-else-if="msg.role === 'user'" class="message-text">{{ msg.content }}</p>
                    <template v-else>
                      <div v-if="msg.content" class="message-text markdown-content" v-html="renderAssistantMessage(msg)" />
                      <div v-if="msg.toolCalls?.length" class="tool-status-list" aria-live="polite">
                        <div v-for="toolCall in msg.toolCalls" :key="toolCall.id" class="tool-status"
                          :class="`tool-status-${toolCall.status}`" role="status"
                          @animationend="removeCompletedToolCall($event, msg.key, toolCall.id, toolCall.status)">
                          <v-progress-circular v-if="toolCall.status === 'running'" indeterminate size="16" width="2" color="secondary" />
                          <v-icon v-else-if="toolCall.status === 'success'" icon="mdi-check-circle-outline" color="success" size="18" />
                          <v-icon v-else icon="mdi-alert-circle-outline" color="error" size="18" />
                          <span>{{ toolCallLabel(toolCall) }}</span>
                        </div>
                      </div>
                    </template>
                  </div>
                  <time class="message-time" :datetime="msg.createdAt">{{ formatTime(msg.createdAt) }}</time>
                </div>
              </template>
            </article>
          </template>
        </div>
        <div v-if="currentConversation && !authRequired" class="input-area">
          <form class="input-row" @submit.prevent="sendMessage">
            <v-textarea id="chat-message" v-model="inputMessage" placeholder="输入你的想法…" auto-grow rows="1" max-rows="5"
              hide-details class="message-input" :disabled="loading || creatingThread" @keydown="onMessageKeydown" />
            <v-btn type="submit" color="primary" :disabled="!inputMessage.trim() || busy" class="send-btn"
              :prepend-icon="sending ? 'mdi-dots-horizontal' : 'mdi-send-outline'">{{ sending ? '回复中' : '发送' }}</v-btn>
          </form>
          <div class="input-note"><span>Enter 发送 · Shift + Enter 换行</span><span role="status" aria-live="polite">{{ sending ? '正在接收回复…' : '' }}</span></div>
        </div>
      </section>
    </div>
    <v-dialog v-model="clearContextDialogOpen" :persistent="creatingThread" max-width="440">
      <v-card>
        <v-card-title>新建会话</v-card-title>
        <v-card-text>确认开始一段新的对话吗？当前聊天记录将结束，但已有记忆会继续保留。</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="creatingThread" @click="clearContextDialogOpen = false">取消</v-btn>
          <v-btn color="primary" :loading="creatingThread" :disabled="creatingThread" @click="clearContext">新建会话</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" class="site-snackbar" location="bottom">
      <span role="alert"><v-icon icon="mdi-alert-circle-outline" size="18" /> {{ snackbar.text }}</span>
      <template #actions><v-btn variant="text" @click="snackbar.show = false">关闭</v-btn></template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { isApiError, useChatApi, type ActiveRunDTO, type ChatRunStreamEvent, type ConversationDTO, type MessageDTO } from '@/api'
import { useAppStore } from '@/stores/app'
import { useDisplay } from 'vuetify'
import DOMPurify from 'isomorphic-dompurify'
import MarkdownIt from 'markdown-it'

useSeoMeta({ title: '聊天 · Ivan1105' })
const { chatApi } = useChatApi()
const appStore = useAppStore()
const { mobile } = useDisplay()
const { assetUrl } = useAssetUrl()
type ToolCallStatus = 'running' | 'success' | 'error'
interface ToolCallState {
  id: string
  name: string
  status: ToolCallStatus
}
type Message = Omit<MessageDTO, 'id' | 'role'> & {
  key: string
  id?: string
  role: MessageDTO['role'] | 'stream-error'
  loading?: boolean
  toolCalls?: ToolCallState[]
}
const toHistoryMessage = (message: MessageDTO | ActiveRunDTO['user_message']): Message => ({
  ...message,
  key: `history:${message.id}`,
})
const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true })
const renderedMessageCache = new WeakMap<Message, { content: string, html: string }>()
const renderAssistantMessage = (message: Message) => {
  const cached = renderedMessageCache.get(message)
  if (cached?.content === message.content) return cached.html
  const html = DOMPurify.sanitize(markdown.render(message.content))
  renderedMessageCache.set(message, { content: message.content, html })
  return html
}

const conversations = ref<ConversationDTO[]>([])
const currentConversationId = ref('')
const currentMessages = ref<Message[]>([])
const inputMessage = ref('')
const messagesAreaRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const conversationsLoading = ref(true)
const conversationsError = ref('')
const messagesError = ref('')
const authRequired = ref(false)
const authErrorMessage = '需要登录，或登录状态已失效，请重新登录。'
const sending = ref(false)
const loadingMore = ref(false)
const historyLoadError = ref(false)
const messagesPage = ref(0)
const messagesHasMore = ref(false)
const messagesTotal = ref(0)
const activeRunId = ref<string | null>(null)
const creatingThread = ref(false)
const clearContextDialogOpen = ref(false)
const settingsMenuOpen = ref(false)
const proactiveUpdating = ref(false)
const journalUpdating = ref(false)
const drawerOpen = ref(false)
const snackbar = reactive({ show: false, text: '', timeout: 6000 })
const showError = (text: string) => {
  snackbar.text = text
  snackbar.show = true
}
const currentConversation = computed(() => conversations.value.find(c => c.name === currentConversationId.value))
const busy = computed(() => authRequired.value || sending.value || creatingThread.value || loading.value || conversationsLoading.value)
const conversationSelectionDisabled = computed(() => authRequired.value || creatingThread.value || loading.value || conversationsLoading.value)
const historyLoaderLabel = computed(() => `加载更早的消息，当前已显示 ${currentMessages.value.length} 条，共 ${messagesTotal.value} 条`)
const MESSAGES_PAGE_SIZE = 20
let messagesLoadVersion = 0
let streamVersion = 0
let streamAbortController: AbortController | null = null
const activeStreamMessageKeys = new Set<string>()
watch(mobile, value => {
  if (!value) drawerOpen.value = false
})

const formatTime = (value: string) => {
  const date = new Date(value)
  const now = new Date()
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  if (date.toDateString() === now.toDateString()) return `${hh}:${mm}`
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${hh}:${mm}`
}
const scrollToBottom = () => {
  if (messagesAreaRef.value) messagesAreaRef.value.scrollTop = messagesAreaRef.value.scrollHeight
}
const toolCallLabel = (toolCall: ToolCallState) => {
  if (toolCall.status === 'running') return `开始工具调用【${toolCall.name}】`
  return `工具请求${toolCall.status === 'success' ? '成功' : '失败'}【${toolCall.name}】`
}
const removeCompletedToolCall = (event: AnimationEvent, messageKey: string, toolCallId: string, status: ToolCallStatus) => {
  if (event.target !== event.currentTarget) return
  if (status === 'running') return
  const message = currentMessages.value.find(item => item.key === messageKey)
  const toolCall = message?.toolCalls?.find(item => item.id === toolCallId)
  if (!message || !toolCall || toolCall.status !== status) return
  message.toolCalls = message.toolCalls?.filter(item => item.id !== toolCallId)
}
const stopActiveStream = () => {
  streamVersion += 1
  streamAbortController?.abort()
  streamAbortController = null
  for (const messageKey of activeStreamMessageKeys) {
    const message = currentMessages.value.find(item => item.key === messageKey)
    if (message) {
      message.loading = false
      message.toolCalls = []
    }
  }
  activeStreamMessageKeys.clear()
  activeRunId.value = null
  sending.value = false
}
const resetMessagesPagination = () => {
  messagesLoadVersion += 1
  messagesPage.value = 0
  messagesHasMore.value = false
  messagesTotal.value = 0
  loadingMore.value = false
  historyLoadError.value = false
}
const handleUnauthorized = (error: unknown) => {
  if (!isApiError(error) || error.status !== 401) return false
  appStore.clearAuth()
  authRequired.value = true
  conversationsError.value = ''
  messagesError.value = ''
  return true
}

const loadConversations = async () => {
  conversationsLoading.value = true
  conversationsError.value = ''
  authRequired.value = false
  try {
    conversations.value = await chatApi.getConversations()
    currentConversationId.value = conversations.value[0]?.name || ''
  } catch (error) {
    conversations.value = []
    if (!handleUnauthorized(error)) conversationsError.value = '会话列表加载失败。'
  } finally {
    conversationsLoading.value = false
  }
}

const loadMessages = async () => {
  const threadId = currentConversation.value?.thread_id
  if (!threadId) return
  stopActiveStream()
  resetMessagesPagination()
  const loadVersion = messagesLoadVersion
  let activeRun: ActiveRunDTO | null = null
  loading.value = true
  messagesError.value = ''
  currentMessages.value = []
  try {
    const result = await chatApi.getMessages(threadId, 0, MESSAGES_PAGE_SIZE)
    if (loadVersion !== messagesLoadVersion || currentConversation.value?.thread_id !== threadId) return
    currentMessages.value = result.messages.map(toHistoryMessage)
    messagesPage.value = result.pagination.page
    messagesHasMore.value = result.pagination.has_more
    messagesTotal.value = result.pagination.total
    activeRun = result.active_run
    if (activeRun) {
      const userMessage = activeRun.user_message
      if (!currentMessages.value.some(message => message.id === userMessage.id)) {
        currentMessages.value.push(toHistoryMessage(userMessage))
      }
      currentMessages.value.push({
        key: `run:${activeRun.run_id}:placeholder`,
        role: 'assistant',
        content: '',
        createdAt: activeRun.started_at,
        loading: true,
      })
    }
  } catch (error) {
    if (loadVersion === messagesLoadVersion && !handleUnauthorized(error)) messagesError.value = '消息加载失败。'
  } finally {
    if (loadVersion === messagesLoadVersion) {
      loading.value = false
      await nextTick()
      scrollToBottom()
    }
  }
  if (activeRun && loadVersion === messagesLoadVersion && currentConversation.value?.thread_id === threadId) {
    void streamActiveRun(activeRun.run_id, `run:${activeRun.run_id}:placeholder`, threadId)
  }
}

const streamActiveRun = async (runId: string, replyKey: string, threadId: string) => {
  if (activeRunId.value === runId && streamAbortController) return

  stopActiveStream()
  const controller = new AbortController()
  const currentStreamVersion = streamVersion
  streamAbortController = controller
  activeRunId.value = runId
  sending.value = true

  const placeholder = currentMessages.value.find(message => message.key === replyKey)
  if (!placeholder) {
    stopActiveStream()
    return
  }
  placeholder.content = ''
  placeholder.loading = true
  placeholder.toolCalls = []
  activeStreamMessageKeys.add(replyKey)

  const initializedMessageKeys = new Set<string>()
  let placeholderClaimed = false
  let messageOrdinal = 0
  let currentStreamMessageKey: string | null = null
  let hasSeenMessageStart = false

  const ensureStreamMessage = (ordinal: number) => {
    const messageKey = `run:${runId}:message:${ordinal}`
    let message = currentMessages.value.find(item => item.key === messageKey)

    if (!placeholderClaimed) {
      placeholderClaimed = true
      if (message && message !== placeholder) {
        const placeholderIndex = currentMessages.value.indexOf(placeholder)
        if (placeholderIndex >= 0) currentMessages.value.splice(placeholderIndex, 1)
        activeStreamMessageKeys.delete(placeholder.key)
      } else {
        activeStreamMessageKeys.delete(placeholder.key)
        placeholder.key = messageKey
        message = placeholder
      }
    }

    if (!message) {
      message = {
        key: messageKey,
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
        loading: true,
        toolCalls: [],
      }
      currentMessages.value.push(message)
    }

    if (!initializedMessageKeys.has(messageKey)) {
      message.content = ''
      message.loading = true
      message.toolCalls = []
      initializedMessageKeys.add(messageKey)
      activeStreamMessageKeys.add(messageKey)
    }

    return message
  }

  const ensureCurrentStreamMessage = () => {
    if (currentStreamMessageKey) {
      const currentMessage = currentMessages.value.find(item => item.key === currentStreamMessageKey)
      if (currentMessage) return currentMessage
    }

    if (messageOrdinal === 0) messageOrdinal = 1
    const message = ensureStreamMessage(messageOrdinal)
    currentStreamMessageKey = message.key
    return message
  }

  const activateNextMessage = () => {
    const previousMessage = currentStreamMessageKey
      ? currentMessages.value.find(item => item.key === currentStreamMessageKey)
      : null
    const reuseImplicitMessage = !hasSeenMessageStart && messageOrdinal === 1
    if (!reuseImplicitMessage) messageOrdinal += 1
    hasSeenMessageStart = true

    const message = ensureStreamMessage(messageOrdinal)
    if (previousMessage && previousMessage.key !== message.key) previousMessage.loading = false
    message.loading = true
    currentStreamMessageKey = message.key
    return message
  }

  const handleStreamEvent = (event: ChatRunStreamEvent) => {
    if (event.type === 'done') return

    if (event.type === 'error') {
      const errorMessageKey = `run:${runId}:error`
      currentMessages.value = currentMessages.value.filter(message => !activeStreamMessageKeys.has(message.key))
      const existingError = currentMessages.value.find(message => message.key === errorMessageKey)
      if (existingError) {
        existingError.content = event.message
        existingError.createdAt = new Date().toISOString()
      } else {
        currentMessages.value.push({
          key: errorMessageKey,
          role: 'stream-error',
          content: event.message,
          createdAt: new Date().toISOString(),
        })
      }
      activeStreamMessageKeys.clear()
      nextTick(scrollToBottom)
      return
    }

    if (event.type === 'message_start') {
      activateNextMessage()
    } else if (event.type === 'text') {
      const message = ensureCurrentStreamMessage()
      message.content += event.content
    } else if (event.type === 'tool_call') {
      const message = ensureCurrentStreamMessage()
      const existingToolCall = message.toolCalls?.find(item => item.id === event.tool_call_id)
      if (existingToolCall) {
        existingToolCall.name = event.tool_name
        existingToolCall.status = 'running'
      } else {
        message.toolCalls?.push({ id: event.tool_call_id, name: event.tool_name, status: 'running' })
      }
    } else if (event.type === 'tool_result') {
      const message = ensureCurrentStreamMessage()
      const status: ToolCallStatus = event.is_error ? 'error' : 'success'
      const existingToolCall = message.toolCalls?.find(item => item.id === event.tool_call_id)
      if (existingToolCall) {
        existingToolCall.name = event.tool_name
        existingToolCall.status = status
      } else {
        message.toolCalls?.push({ id: event.tool_call_id, name: event.tool_name, status })
      }
    }
    nextTick(scrollToBottom)
  }

  try {
    await chatApi.streamRun(runId, (event) => {
      if (currentStreamVersion !== streamVersion || currentConversation.value?.thread_id !== threadId) return
      handleStreamEvent(event)
    }, controller.signal)
  } catch (error) {
    if (currentStreamVersion === streamVersion && !controller.signal.aborted) {
      currentMessages.value = currentMessages.value.filter(message => (
        !activeStreamMessageKeys.has(message.key) || message.content.trim().length > 0
      ))
      if (!handleUnauthorized(error)) showError('回复连接中断，刷新页面可继续获取。')
    }
  } finally {
    if (currentStreamVersion === streamVersion) {
      for (const messageKey of activeStreamMessageKeys) {
        const message = currentMessages.value.find(item => item.key === messageKey)
        if (message) {
          message.loading = false
          message.toolCalls = message.toolCalls?.filter(toolCall => toolCall.status !== 'running')
        }
      }
      activeStreamMessageKeys.clear()
      streamAbortController = null
      activeRunId.value = null
      sending.value = false
      await nextTick()
      scrollToBottom()
    }
  }
}

const loadOlderMessages = async () => {
  const threadId = currentConversation.value?.thread_id
  if (!threadId || authRequired.value || loading.value || loadingMore.value || !messagesHasMore.value) return

  const loadVersion = messagesLoadVersion
  const nextPage = messagesPage.value + 1
  const messagesArea = messagesAreaRef.value
  const previousScrollHeight = messagesArea?.scrollHeight ?? 0
  const previousScrollTop = messagesArea?.scrollTop ?? 0
  loadingMore.value = true
  historyLoadError.value = false
  let loadedPage = false

  try {
    const result = await chatApi.getMessages(threadId, nextPage, MESSAGES_PAGE_SIZE)
    if (loadVersion !== messagesLoadVersion || currentConversation.value?.thread_id !== threadId) return

    const existingIds = new Set(currentMessages.value.flatMap(message => message.id ? [message.id] : []))
    const olderMessages = result.messages
      .filter(message => !existingIds.has(message.id))
      .map(toHistoryMessage)
    currentMessages.value = [...olderMessages, ...currentMessages.value]
    messagesPage.value = result.pagination.page
    messagesHasMore.value = result.pagination.has_more
    messagesTotal.value = result.pagination.total
    loadedPage = true

    await nextTick()
    if (messagesArea && messagesAreaRef.value === messagesArea) {
      messagesArea.scrollTop = messagesArea.scrollHeight - previousScrollHeight + previousScrollTop
    }
  } catch (error) {
    if (loadVersion === messagesLoadVersion && !handleUnauthorized(error)) {
      historyLoadError.value = true
      showError('更早的消息加载失败，请稍后重试。')
    }
  } finally {
    if (loadVersion === messagesLoadVersion) {
      loadingMore.value = false
      await nextTick()
      const area = messagesAreaRef.value
      if (loadedPage && messagesHasMore.value && area && area.scrollHeight <= area.clientHeight + 1) {
        void loadOlderMessages()
      }
    }
  }
}

const onHistoryIntersect = (isIntersecting: boolean) => {
  if (isIntersecting && !historyLoadError.value) void loadOlderMessages()
}

const selectConversation = async (id: string) => {
  if (conversationSelectionDisabled.value) return
  drawerOpen.value = false
  if (id === currentConversationId.value) return
  stopActiveStream()
  currentConversationId.value = id
  currentMessages.value = []
  await loadMessages()
}

const updateProactiveReminder = async (value: boolean | null) => {
  const conversation = currentConversation.value
  if (!conversation || proactiveUpdating.value) return
  const enabled = Boolean(value)
  if (enabled === conversation.proactive_enabled) return

  proactiveUpdating.value = true
  try {
    await chatApi.updateProactive({ agentId: conversation.name, enabled })
    conversation.proactive_enabled = enabled
  } catch (error) {
    if (!handleUnauthorized(error)) showError('主动提醒设置失败，请稍后重试。')
  } finally {
    proactiveUpdating.value = false
  }
}

const updateJournal = async (value: boolean | null) => {
  const conversation = currentConversation.value
  if (!conversation || journalUpdating.value) return
  const enabled = Boolean(value)
  if (enabled === conversation.journal_enabled) return

  journalUpdating.value = true
  try {
    await chatApi.updateJournal({ agentId: conversation.name, enabled })
    conversation.journal_enabled = enabled
  } catch (error) {
    if (!handleUnauthorized(error)) showError('自动记录日志设置失败，请稍后重试。')
  } finally {
    journalUpdating.value = false
  }
}

const openClearContextDialog = () => {
  settingsMenuOpen.value = false
  clearContextDialogOpen.value = true
}

const clearContext = async () => {
  const conversation = currentConversation.value
  if (!conversation || creatingThread.value) return
  creatingThread.value = true
  stopActiveStream()
  try {
    const thread = await chatApi.createThread(conversation.name)
    conversation.thread_id = thread.thread_id
    resetMessagesPagination()
    currentMessages.value = []
    messagesError.value = ''
    clearContextDialogOpen.value = false
  } catch (error) {
    if (handleUnauthorized(error)) {
      clearContextDialogOpen.value = false
    } else {
      showError('上下文清空失败，请稍后重试。')
    }
  } finally {
    creatingThread.value = false
  }
}

const onMessageKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey || event.isComposing || event.keyCode === 229) return
  event.preventDefault()
  void sendMessage()
}

const sendMessage = async () => {
  const content = inputMessage.value.trim()
  if (!content || busy.value || !currentConversation.value) return
  sending.value = true
  messagesError.value = ''
  const nowIso = new Date().toISOString()
  currentMessages.value.push({ key: `local:user:${crypto.randomUUID()}`, role: 'user', content, createdAt: nowIso })
  inputMessage.value = ''
  let replyKey = `local:reply:${crypto.randomUUID()}`
  currentMessages.value.push({ key: replyKey, role: 'assistant', content: '', createdAt: nowIso, loading: true })
  await nextTick()
  scrollToBottom()
  try {
    const threadId = currentConversation.value.thread_id
    const run = await chatApi.sendMessage({ content, agentId: currentConversationId.value, threadId })
    if (currentConversation.value?.thread_id !== threadId || run.thread_id !== threadId) {
      const idx = currentMessages.value.findIndex(message => message.key === replyKey)
      if (idx >= 0 && !currentMessages.value[idx]?.content) currentMessages.value.splice(idx, 1)
      sending.value = false
      return
    }
    const reply = currentMessages.value.find(message => message.key === replyKey)
    if (!reply) {
      sending.value = false
      return
    }
    replyKey = `run:${run.run_id}:placeholder`
    reply.key = replyKey
    void streamActiveRun(run.run_id, replyKey, threadId)
  } catch (error) {
    const idx = currentMessages.value.findIndex(message => message.key === replyKey)
    if (idx >= 0 && !currentMessages.value[idx]?.content) currentMessages.value.splice(idx, 1)
    if (!handleUnauthorized(error)) showError('回复未能完成，请稍后重新发送。')
    sending.value = false
    await nextTick()
    scrollToBottom()
  }
}
onMounted(async () => {
  await loadConversations()
  await loadMessages()
})
onBeforeUnmount(stopActiveStream)
</script>

<style scoped>
.chatbox-page {
  max-width: 1440px;
  margin: auto;
  padding: 28px 32px 24px;
  height: calc(100dvh - var(--site-nav-height));
  min-height: 440px;
  display: flex;
  flex-direction: column;
}

.chat-page-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--site-space-3);
  margin-bottom: 22px;
  flex-shrink: 0;
}

.chat-page-heading .eyebrow {
  font-size: 0.6rem;
}

.chat-page-heading h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 5px;
}

.chat-page-heading > p {
  font-size: 0.8rem;
}

.chatbox-container {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.desktop-conversations {
  width: 280px;
  flex-shrink: 0;
  overflow: hidden;
}

.chat-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--site-border);
}

.header-avatar {
  flex-shrink: 0;
}

.chat-header-text {
  min-width: 0;
  flex: 1;
}

.chat-header h2 {
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-header p {
  color: var(--site-muted);
  font-size: 0.72rem;
  margin-top: 3px;
}

.chat-settings-trigger {
  flex-shrink: 0;
}

.chat-settings-menu {
  width: min(360px, calc(100vw - 24px));
  padding-block: 6px;
  border: 1px solid var(--site-border);
}

.chat-setting-item {
  min-height: 76px;
  padding-block: 10px;
}

.chat-setting-description {
  margin-top: 4px;
  color: var(--site-muted);
  font-size: 0.72rem;
  line-height: 1.55;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  -webkit-line-clamp: unset;
}

.chat-setting-item :deep(.v-list-item__prepend) {
  align-self: start;
  padding-top: 3px;
}

.settings-toggle-item :deep(.v-list-item__append) {
  align-self: center;
  margin-inline-start: var(--site-space-3);
}

.settings-toggle-item :deep(.v-switch) {
  flex: 0 0 auto;
}

.messages-area {
  min-height: 0;
  min-width: 0;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--site-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--site-space-3);
  scrollbar-width: thin;
  scrollbar-color: #9bbeb6 transparent;
}

.messages-area:focus-visible {
  outline-offset: -4px;
}

.chat-state {
  margin: auto;
  text-align: center;
  padding: 28px 12px;
  max-width: 440px;
  color: var(--site-muted);
}

.chat-state h3 {
  margin: 10px 0;
  color: var(--site-text);
  font-size: 1.5rem;
  font-weight: 550;
}

.chat-state p {
  font-size: 0.88rem;
  line-height: 1.85;
}

.chat-state .eyebrow {
  font-size: 0.6rem;
}

.chat-state .v-btn {
  margin-top: 22px;
}

.state-icon {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  margin: 0 auto 22px;
  border: 1px solid var(--site-border);
  border-radius: 24px;
  background: var(--site-soft);
  color: var(--site-accent);
}

.message-row {
  display: flex;
  align-items: start;
  gap: 10px;
  flex-shrink: 0;
  min-width: 0;
}

.message-self {
  justify-content: flex-end;
}

.message-signal {
  width: 100%;
  justify-content: center;
  padding-block: 2px;
}

.signal-message {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  max-width: min(760px, 100%);
  color: var(--site-muted);
  font-size: 0.72rem;
  line-height: 1.5;
  text-align: center;
  overflow-wrap: anywhere;
}

.stream-error-message {
  color: rgb(var(--v-theme-error));
}

.message-avatar {
  margin-top: 25px;
  flex-shrink: 0;
}

.message-self .message-avatar {
  order: 2;
}

.message-bubble-wrapper {
  display: flex;
  flex-direction: column;
  align-items: start;
  min-width: 0;
  max-width: min(760px, 85%);
}

.message-self .message-bubble-wrapper {
  align-items: end;
}

.message-author {
  color: var(--site-muted);
  font-size: 0.72rem;
  margin-bottom: 6px;
}

.message-bubble {
  max-width: 100%;
  min-width: 0;
  padding: 14px 18px;
  border: 1px solid var(--site-border);
  border-radius: 0 16px 16px 16px;
}

.bubble-other {
  background: var(--site-bg);
}

.bubble-self {
  background: #ddf3ed;
  border-color: #c4e8df;
  border-radius: 16px 0 16px 16px;
}

.message-text {
  font-size: 1rem;
  line-height: 1.8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin: 0;
}

.message-time {
  font-size: 0.67rem;
  color: var(--site-muted);
  margin-top: 6px;
}

.reply-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: var(--site-muted);
}

.tool-status-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 10px;
}

.tool-status-list:first-child {
  margin-top: 0;
}

.tool-status {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--site-muted);
  overflow-wrap: anywhere;
}

.tool-status-success {
  color: rgb(var(--v-theme-success));
  animation: tool-status-expire 2s ease forwards;
}

.tool-status-error {
  color: rgb(var(--v-theme-error));
  animation: tool-status-expire 2s ease forwards;
}

@keyframes tool-status-expire {
  0%, 78% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tool-status-success,
  .tool-status-error {
    animation-name: tool-status-expire-reduced;
  }
}

@keyframes tool-status-expire-reduced {
  from, to {
    opacity: 1;
  }
}

.history-loader {
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--site-space-1);
  flex-shrink: 0;
  color: var(--site-muted);
  font-size: 0.72rem;
}

.markdown-content {
  white-space: normal;
}

.markdown-content :deep(p), .markdown-content :deep(ul), .markdown-content :deep(ol), .markdown-content :deep(blockquote), .markdown-content :deep(pre), .markdown-content :deep(table) {
  margin: 0 0 0.85em;
}

.markdown-content :deep(:last-child) {
  margin-bottom: 0;
}

.markdown-content :deep(h1), .markdown-content :deep(h2), .markdown-content :deep(h3), .markdown-content :deep(h4), .markdown-content :deep(h5), .markdown-content :deep(h6) {
  margin: 1em 0 0.5em;
  font-size: 1.1em;
  line-height: 1.5;
}

.markdown-content :deep(ul), .markdown-content :deep(ol) {
  padding-left: 1.5em;
}

.markdown-content :deep(blockquote) {
  border-left: 3px solid var(--site-primary);
  padding-left: 14px;
  color: var(--site-muted);
}

.markdown-content :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.87em;
  background: #e1eeea;
  padding: 2px 5px;
  border-radius: 4px;
}

.markdown-content :deep(pre) {
  max-width: 100%;
  overflow-x: auto;
  padding: 14px;
  background: #e7f1ee;
  border: 1px solid var(--site-border);
  border-radius: 8px;
  white-space: pre;
  overflow-wrap: normal;
}

.markdown-content :deep(pre code) {
  padding: 0;
  background: transparent;
}

.markdown-content :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
  white-space: nowrap;
  overflow-wrap: normal;
}

.markdown-content :deep(th), .markdown-content :deep(td) {
  padding: 8px 12px;
  border: 1px solid #bdd6ce;
}

.markdown-content :deep(th) {
  background: var(--site-soft);
}

.markdown-content :deep(a) {
  color: var(--site-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.markdown-content :deep(hr) {
  border: 0;
  border-top: 1px solid var(--site-border);
  margin-block: 16px;
}

.input-area {
  padding: 18px 24px 12px;
  border-top: 1px solid var(--site-border);
  flex-shrink: 0;
}

.composer-label {
  display: block;
  margin-bottom: 6px;
  color: var(--site-muted);
  font-size: 0.75rem;
}

.input-row {
  display: flex;
  align-items: end;
  gap: 12px;
}

.message-input {
  min-width: 0;
}

.send-btn {
  min-width: 100px;
  height: 56px !important;
}

.input-note {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px;
  color: var(--site-muted);
  font-size: 0.65rem;
  margin-top: var(--site-space-1);
  min-height: 18px;
}

.mobile-conversations-toggle {
  display: none;
}

.drawer-card {
  height: 100%;
  border-radius: 0 20px 20px 0 !important;
}

@media (max-width: 959px) {
  .chatbox-page {
    padding: 20px 20px 16px;
  }
  .desktop-conversations {
    display: none;
  }
  .mobile-conversations-toggle {
    display: inline-grid;
    flex-shrink: 0;
  }
  .chat-header {
    padding: 14px 16px;
    gap: 10px;
  }
}

@media (max-width: 600px) {
  .chatbox-page {
    padding: 12px 12px max(12px, env(safe-area-inset-bottom));
    min-height: 0;
  }
  .chat-page-heading {
    display: none;
  }
  .chat-area {
    border-radius: 16px;
  }
  .chat-header {
    padding: var(--site-space-1);
    gap: 6px;
  }
  .header-avatar {
    display: none;
  }
  .chat-header h2 {
    font-size: 0.9rem;
  }
  .chat-header p {
    font-size: 0.65rem;
  }
  .chat-settings-trigger {
    width: 36px;
    height: 36px;
  }
  .messages-area {
    padding: 16px 12px;
    gap: 20px;
  }
  .message-bubble-wrapper {
    max-width: calc(100% - 42px);
  }
  .message-bubble {
    padding: 11px 13px;
  }
  .input-area {
    padding: 12px 10px 8px;
  }
  .input-row {
    gap: var(--site-space-1);
  }
  .send-btn {
    min-width: 76px;
    padding-inline: 12px;
    font-size: 0.8rem;
  }
  .send-btn :deep(.v-btn__prepend) {
    display: none;
  }
  .chat-state h3 {
    font-size: 1.25rem;
  }
  .chat-state p {
    font-size: 0.8rem;
  }
}

@media (max-height: 550px) {
  .chat-page-heading {
    display: none;
  }
  .chatbox-page {
    min-height: 0;
    padding-block: var(--site-space-1);
  }
  .input-note {
    display: none;
  }
  .chat-header {
    padding-block: 6px;
  }
  .input-area {
    padding-block: var(--site-space-1);
  }
  .chat-state {
    padding-block: var(--site-space-1);
  }
  .state-icon {
    display: none;
  }
}
</style>
