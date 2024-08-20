import React, { ReactElement, useEffect } from 'react'

import { createChatMessagesEndpoint, useLoadFromEndpoint } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import useIsTabActive from '../hooks/useIsTabActive'
import Chat from './Chat'

type ChatInitializedViewProps = {
  city: string
  language: string
  deviceId: string
  submitMessage: (text: string, refreshMessages: () => void) => void
}

const POLLING_INTERVAL = 16000
const ChatInitializedView = ({ city, deviceId, language, submitMessage }: ChatInitializedViewProps): ReactElement => {
  const {
    data: chatMessages,
    refresh: refreshMessages,
    error,
  } = useLoadFromEndpoint(createChatMessagesEndpoint, cmsApiBaseUrl, { city, language, deviceId })
  const isBrowserTabActive = useIsTabActive()

  useEffect(() => {
    if (!isBrowserTabActive) {
      return undefined
    }
    const pollMessageInterval = setInterval(refreshMessages, POLLING_INTERVAL)
    return () => clearInterval(pollMessageInterval)
  }, [refreshMessages, isBrowserTabActive])

  return (
    <Chat
      messages={chatMessages !== null ? chatMessages : []}
      submitMessage={(text: string) => submitMessage(text, refreshMessages)}
      hasError={!!error}
      isLoading={chatMessages === null}
    />
  )
}

export default ChatInitializedView
