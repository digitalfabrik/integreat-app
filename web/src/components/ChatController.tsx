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
const POLLING_INTERVAL = 16000

const ChatController = ({ city, language }: ChatControllerProps): ReactElement => {
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const { value: deviceId } = useLocalStorage({
    key: `${LOCAL_STORAGE_ITEM_CHAT_MESSAGES}-${city}`,
    initialValue: window.crypto.randomUUID(),
  })
  const {
    data: chatMessages,
    refresh: refreshMessages,
    error,
    loading,
    setData,
  } = useLoadFromEndpoint(createChatMessagesEndpoint, cmsApiBaseUrl, { city, language, deviceId })
  const isBrowserTabActive = useIsTabActive()

  useEffect(() => {
    if (isBrowserTabActive) {
      const pollMessageInterval = setInterval(refreshMessages, POLLING_INTERVAL)
      return () => clearInterval(pollMessageInterval)
    }
    return undefined
  }, [refreshMessages, isBrowserTabActive])

  const submitMessage = async (message: string) => {
    setSendingStatus('sending')
    const { data, error } = await createSendChatMessageEndpoint(cmsApiBaseUrl).request({
      city,
      language,
      message,
      deviceId,
    })

    if (data !== null) {
      setData(messages => [...(messages ?? []), data])
      setSendingStatus('successful')
    }

    if (error !== null) {
      setSendingStatus('failed')
    }
  }

  return (
    <Chat
      messages={chatMessages ?? []}
      submitMessage={submitMessage}
      // If no message has been sent yet, fetching the messages yields a 404 not found error
      hasError={error !== null && !(error instanceof NotFoundError)}
      isLoading={chatMessages === null && (loading || sendingStatus === 'sending')}
    />
  )
}

export default ChatController
