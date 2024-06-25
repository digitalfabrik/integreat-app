import React, { ReactElement, useState } from 'react'

import { createSendChatMessageEndpoint } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import useLocalStorage from '../hooks/useLocalStorage'
import Chat from './Chat'
import ChatInitializedView from './ChatInitializedView'
import { SendingStatusType } from './FeedbackContainer'

type ChatControllerProps = {
  city: string
  language: string
}

const LOCAL_STORAGE_ITEM_CHAT_MESSAGES = 'Chat-Device-Id'
const ChatController = ({ city, language }: ChatControllerProps): ReactElement => {
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const { value: storedDeviceId, updateLocalStorageItem: setDeviceId } = useLocalStorage<string>(
    LOCAL_STORAGE_ITEM_CHAT_MESSAGES,
  )
  // 2833 TODO Improve useLocalStorage hook with a default/init method
  const hasOpenChatSession = !!(typeof storedDeviceId === 'string' && storedDeviceId)

  const submitMessage = async (text: string, storedDeviceId?: string, refreshMessages?: () => void) => {
    setSendingStatus('sending')
    const deviceId = storedDeviceId ?? window.self.crypto.randomUUID()
    const { data, error } = await createSendChatMessageEndpoint(cmsApiBaseUrl).request({
      city,
      language,
      message: text,
      deviceId,
    })

    if (data !== null) {
      setSendingStatus('successful')
      setDeviceId(deviceId)
      if (refreshMessages) {
        refreshMessages()
      }
    }

    if (error !== null) {
      setSendingStatus('failed')
    }
  }

  if (hasOpenChatSession) {
    return (
      <ChatInitializedView deviceId={storedDeviceId} city={city} language={language} submitMessage={submitMessage} />
    )
  }
  return (
    <Chat
      submitMessage={submitMessage}
      messages={[]}
      hasError={sendingStatus === 'failed'}
      isLoading={sendingStatus === 'sending' && !hasOpenChatSession}
    />
  )
}

export default ChatController
