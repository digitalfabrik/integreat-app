import React, { ReactElement, useState } from 'react'

import { createSendChatMessageEndpoint } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import useLocalStorage from '../hooks/useLocalStorage'
import ChatInitializedView from './ChatInitializedView'
import { SendingStatusType } from './FeedbackContainer'

type ChatControllerProps = {
  city: string
  language: string
}

const LOCAL_STORAGE_ITEM_CHAT_MESSAGES = 'Chat-Device-Id'
const ChatController = ({ city, language }: ChatControllerProps): ReactElement => {
  const [_, setSendingStatus] = useState<SendingStatusType>('idle')
  const { value: deviceId } = useLocalStorage({
    key: LOCAL_STORAGE_ITEM_CHAT_MESSAGES,
    initialValue: window.crypto.randomUUID(),
  })

  const submitMessage = async (message: string, refreshMessages?: () => void) => {
    setSendingStatus('sending')
    const { data, error } = await createSendChatMessageEndpoint(cmsApiBaseUrl).request({
      city,
      language,
      message,
      deviceId,
    })

    if (data !== null) {
      setSendingStatus('successful')
      if (refreshMessages) {
        refreshMessages()
      }
    }

    if (error !== null) {
      setSendingStatus('failed')
    }
  }

  return <ChatInitializedView deviceId={deviceId} city={city} language={language} submitMessage={submitMessage} />
}

export default ChatController
