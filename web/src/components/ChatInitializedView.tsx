import React, { ReactElement, useEffect } from 'react'

import { createChatMessageEndpoint, useLoadFromEndpoint } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import Chat from './Chat'

type ChatInitializedViewProps = {
  city: string
  language: string
  deviceId: string
  submitMessage: (text: string, deviceId?: string) => void
}

const POLLING_INTERVAL = 16000
const ChatInitializedView = ({ city, deviceId, language, submitMessage }: ChatInitializedViewProps): ReactElement => {
  const {
    data: chatMessages,
    refresh: refreshMessages,
    error,
  } = useLoadFromEndpoint(createChatMessageEndpoint, cmsApiBaseUrl, { city, language, deviceId })

  useEffect(() => {
    const pollMessageInterval = setInterval(refreshMessages, POLLING_INTERVAL)
    return () => clearInterval(pollMessageInterval)
  }, [refreshMessages])

  return (
    <Chat
      messages={chatMessages !== null ? chatMessages : []}
      submitMessage={submitMessage}
      deviceId={deviceId}
      hasError={!!error}
      isLoading={chatMessages === null}
      refreshMessages={refreshMessages}
    />
  )
}

export default ChatInitializedView
