import React, { ReactElement, useEffect, useState } from 'react'

import { SendingStatusType } from 'shared'
import {
  CityModel,
  createChatMessagesEndpoint,
  createSendChatMessageEndpoint,
  NotFoundError,
  useLoadFromEndpoint,
} from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import useIsTabActive from '../hooks/useIsTabActive'
import useLocalStorage from '../hooks/useLocalStorage'
import { generateChatId } from '../utils/chatId'
import Chat from './Chat'

type ChatControllerProps = {
  city: CityModel
  languageCode: string
  chatId: string | null
  updateChatId: (newChatId: string | null) => void
}

export const LOCAL_STORAGE_ITEM_CHAT_MESSAGES = 'Chat-Device-Id'
const LOCAL_STORAGE_ITEM_CHAT_PRIVACY_POLICIES = 'Chat-Privacy-Policies'
const DEFAULT_POLLING_INTERVAL = 15000
const TYPING_POLLING_INTERVAL = 3000

const ChatController = ({ city, languageCode, chatId, updateChatId }: ChatControllerProps): ReactElement => {
  const cityCode = city.code
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const isBrowserTabActive = useIsTabActive()

  const initializeChat = (): string => {
    const newId = generateChatId()
    updateChatId(newId)
    return newId
  }

  const {
    data: chatMessagesReturn,
    refresh: refreshMessages,
    error,
    loading,
    setData,
  } = useLoadFromEndpoint(createChatMessagesEndpoint, cmsApiBaseUrl, {
    cityCode,
    language: languageCode,
    deviceId: chatId ?? '',
  })
  const botTyping = chatMessagesReturn?.botTyping
  const messageCount = chatMessagesReturn?.messages.length ?? 0

  const { value, updateLocalStorageItem } = useLocalStorage<Record<string, boolean>>({
    key: LOCAL_STORAGE_ITEM_CHAT_PRIVACY_POLICIES,
    initialValue: {},
  })
  const privacyPolicyAccepted = value[city.code] ?? false
  const acceptCustomPrivacyPolicy = () => updateLocalStorageItem({ ...value, [city.code]: true })

  useEffect(() => {
    if (!isBrowserTabActive || messageCount === 0) {
      return undefined
    }
    const interval = setInterval(refreshMessages, botTyping ? TYPING_POLLING_INTERVAL : DEFAULT_POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [refreshMessages, isBrowserTabActive, messageCount, botTyping])

  const submitMessage = async (message: string) => {
    setSendingStatus('sending')
    const { data, error } = await createSendChatMessageEndpoint(cmsApiBaseUrl).request({
      cityCode,
      language: languageCode,
      message,
      deviceId: chatId ?? initializeChat(),
    })

    if (data !== null) {
      setData(data)
      setSendingStatus('successful')
    }

    if (error !== null) {
      setSendingStatus('failed')
    }
  }

  return (
    <Chat
      city={city}
      messages={chatMessagesReturn?.messages ?? []}
      submitMessage={submitMessage}
      // If no message has been sent yet, fetching the messages yields a 404 not found error
      hasError={error !== null && !(error instanceof NotFoundError)}
      isLoading={chatMessagesReturn === null && (loading || sendingStatus === 'sending')}
      isTyping={botTyping ?? false}
      privacyPolicyAccepted={privacyPolicyAccepted}
      acceptPrivacyPolicy={acceptCustomPrivacyPolicy}
      languageCode={languageCode}
    />
  )
}

export default ChatController
