import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { CHAT_DEFAULT_POLLING_INTERVAL, CHAT_TYPING_POLLING_INTERVAL, parseQueryParams, uuid } from 'shared'
import { ChatMessagesReturn, createChatMessagesEndpoint, RegionModel, SerializedChatMessage } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import { chatIdKey, chatSeenMessagesKey } from '../utils/chat'
import useIsTabActive from './useIsTabActive'
import useLocalStorage, { CHAT_UNSYNCED_MESSAGES_STORAGE_KEY, UpdateLocalStorage } from './useLocalStorage'
import useQueryFromEndpoint, { UseQueryFromEndpointReturn } from './useQueryFromEndpoint'

type ChatPollingProps = {
  regionCode: string
  languageCode: string
  chatId: string
  enabled: boolean
}

const useChatPolling = ({ enabled, ...params }: ChatPollingProps): UseQueryFromEndpointReturn<ChatMessagesReturn> => {
  const response = useQueryFromEndpoint(createChatMessagesEndpoint, cmsApiBaseUrl, params, { cached: false, enabled })
  const isBrowserTabActive = useIsTabActive()

  const { data, refetch } = response
  const botTyping = data?.botTyping
  const messageCount = data?.messages.length ?? 0

  // Polling continues while mounted and enabled, independent of whether the chat dialog is
  // currently open, so the unread badge keeps updating in the background.
  useEffect(() => {
    if (!enabled || !isBrowserTabActive || messageCount === 0) {
      return undefined
    }
    const interval = setInterval(refetch, botTyping ? CHAT_TYPING_POLLING_INTERVAL : CHAT_DEFAULT_POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [enabled, refetch, isBrowserTabActive, messageCount, botTyping])

  return response
}

type UseChatProps = {
  region: RegionModel
  languageCode: string
}

export type UseChatReturn = {
  chatId: string
  response: UseQueryFromEndpointReturn<ChatMessagesReturn>
  unreadMessageCount: number
  markAsSeen: () => void
  resetChat: () => void
  serializedUnsyncedMessages: SerializedChatMessage[]
  setUnsyncedMessages: UpdateLocalStorage<SerializedChatMessage[]>
}

const useChat = ({ region, languageCode }: UseChatProps): UseChatReturn => {
  const [queryParams] = useSearchParams()
  const [initialChatId] = useState<string>(uuid)
  // The chat id is only persisted once the chat is opened, so we can avoid requests for users who never use the chat
  const [storageChatId, setChatId] = useLocalStorage<string | null>({
    key: chatIdKey(region.code),
    initialValue: null,
  })
  const [seenMessages, setSeenMessages] = useLocalStorage<number>({
    key: chatSeenMessagesKey(region.code),
    initialValue: 0,
  })
  const [unsyncedMessages, setUnsyncedMessages] = useLocalStorage<SerializedChatMessage[]>({
    key: CHAT_UNSYNCED_MESSAGES_STORAGE_KEY,
    initialValue: [],
  })

  const { chatId: externalChatId, chat: chatOpen } = parseQueryParams(queryParams)
  const chatId = externalChatId ?? storageChatId ?? initialChatId
  const chatStarted = storageChatId !== null
  const enabled = !!externalChatId || (region.chatEnabled && (chatStarted || !!chatOpen))
  const response = useChatPolling({ regionCode: region.code, languageCode, chatId, enabled })

  useEffect(() => {
    if (region.chatEnabled && chatOpen && !externalChatId && storageChatId === null) {
      setChatId(initialChatId)
    }
  }, [region.chatEnabled, chatOpen, externalChatId, storageChatId, setChatId, initialChatId])

  const incomingMessageCount = response.data?.messages.filter(message => !message.userIsAuthor).length ?? 0
  const unreadMessageCount = incomingMessageCount - seenMessages

  const markAsSeen = useCallback(() => {
    setSeenMessages(previous => (incomingMessageCount > previous ? incomingMessageCount : previous))
  }, [incomingMessageCount, setSeenMessages])

  const resetChat = () => {
    setUnsyncedMessages([])
    setChatId(uuid())
    setSeenMessages(0)
  }

  return {
    chatId,
    response,
    unreadMessageCount,
    markAsSeen,
    resetChat,
    serializedUnsyncedMessages: unsyncedMessages,
    setUnsyncedMessages,
  }
}

export default useChat
