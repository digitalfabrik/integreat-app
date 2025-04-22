import React, { ReactElement, useEffect, useState } from 'react'

import {
  createChatMessagesEndpoint,
  createSendChatMessageEndpoint,
  NotFoundError,
  useLoadFromEndpoint,
} from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import useIsTabActive from '../hooks/useIsTabActive'
import useLocalStorage from '../hooks/useLocalStorage'
import Chat from './Chat'
import { SendingStatusType } from './FeedbackContainer'

type ChatControllerProps = {
  city: string
  language: string
}

const LOCAL_STORAGE_ITEM_CHAT_MESSAGES = 'Chat-Device-Id'
const POLLING_INTERVAL = 8000

const ChatController = ({ city, language }: ChatControllerProps): ReactElement => {
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const { value: deviceId } = useLocalStorage({
    key: `${LOCAL_STORAGE_ITEM_CHAT_MESSAGES}-${city}`,
    initialValue: window.crypto.randomUUID(),
  })
  const {
    data: chatMessagesReturn,
    refresh: refreshMessages,
    error,
    loading,
    setData,
  } = useLoadFromEndpoint(createChatMessagesEndpoint, cmsApiBaseUrl, { city, language, deviceId })
  const isBrowserTabActive = useIsTabActive()

  useEffect(() => {
    const messageCount = chatMessagesReturn?.messages.length ?? 0
    if (!isBrowserTabActive || messageCount === 0) {
      return
    }
    const interval = setInterval(refreshMessages, POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [refreshMessages, isBrowserTabActive, chatMessagesReturn?.messages.length])

  const submitMessage = async (message: string) => {
    setSendingStatus('sending')
    const { data, error } = await createSendChatMessageEndpoint(cmsApiBaseUrl).request({
      city,
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
      messages={chatMessagesReturn?.messages ?? []}
      submitMessage={submitMessage}
      // If no message has been sent yet, fetching the messages yields a 404 not found error
      hasError={error !== null && !(error instanceof NotFoundError)}
      isLoading={chatMessagesReturn === null && (loading || sendingStatus === 'sending')}
      isTyping={chatMessagesReturn?.typing ?? false}
    />
  )
}

export default ChatController
