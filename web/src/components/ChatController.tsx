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
import Chat from './Chat'

type ChatControllerProps = {
  city: CityModel
  language: string
}

const LOCAL_STORAGE_ITEM_CHAT_MESSAGES = 'Chat-Device-Id'
const LOCAL_STORAGE_ITEM_CHAT_PRIVACY_POLICIES = 'Chat-Privacy-Policies'
const POLLING_INTERVAL = 8000

const ChatController = ({ city, language }: ChatControllerProps): ReactElement => {
  const cityCode = city.code
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const { value: deviceId } = useLocalStorage({
    key: `${LOCAL_STORAGE_ITEM_CHAT_MESSAGES}-${cityCode}`,
    initialValue: window.crypto.randomUUID(),
  })
  const {
    data: chatMessagesReturn,
    refresh: refreshMessages,
    error,
    loading,
    setData,
  } = useLoadFromEndpoint(createChatMessagesEndpoint, cmsApiBaseUrl, { cityCode, language, deviceId })
  const isBrowserTabActive = useIsTabActive()

  const { value, updateLocalStorageItem } = useLocalStorage<Record<string, boolean>>({
    key: LOCAL_STORAGE_ITEM_CHAT_PRIVACY_POLICIES,
    initialValue: {},
  })
  const privacyPolicyAccepted = value[city.code] ?? false
  const acceptCustomPrivacyPolicy = () => updateLocalStorageItem({ ...value, [city.code]: true })

  useEffect(() => {
    const messageCount = chatMessagesReturn?.messages.length ?? 0
    if (!isBrowserTabActive || messageCount === 0) {
      return undefined
    }
    const interval = setInterval(refreshMessages, POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [refreshMessages, isBrowserTabActive, chatMessagesReturn?.messages.length])

  const submitMessage = async (message: string) => {
    setSendingStatus('sending')
    const { data, error } = await createSendChatMessageEndpoint(cmsApiBaseUrl).request({
      cityCode,
      language,
      message,
      deviceId,
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
      isTyping={chatMessagesReturn?.typing ?? false}
      privacyPolicyAccepted={privacyPolicyAccepted}
      acceptPrivacyPolicy={acceptCustomPrivacyPolicy}
      languageCode={language}
    />
  )
}

export default ChatController
