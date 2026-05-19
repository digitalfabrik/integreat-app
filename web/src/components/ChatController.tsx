import React, { ReactElement, useEffect, useState } from 'react'

import { RegionModel, createChatMessagesEndpoint, createSendChatMessageEndpoint, NotFoundError } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import useIsTabActive from '../hooks/useIsTabActive'
import useLocalStorage, { CHAT_PRIVACY_POLICIES_STORAGE_KEY } from '../hooks/useLocalStorage'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import Chat from './Chat'

type ChatControllerProps = {
  region: RegionModel
  languageCode: string
  chatId: string
}

const DEFAULT_POLLING_INTERVAL = 15000
const TYPING_POLLING_INTERVAL = 3000

const ChatController = ({ region, languageCode, chatId }: ChatControllerProps): ReactElement => {
  const [sendingError, setSendingError] = useState<Error | null>(null)
  const isBrowserTabActive = useIsTabActive()

  const {
    data,
    refetch: refreshMessages,
    error,
    isPending,
    setData,
  } = useQueryFromEndpoint(
    createChatMessagesEndpoint,
    cmsApiBaseUrl,
    {
      regionCode: region.code,
      language: languageCode,
      deviceId: chatId,
    },
    { cached: false },
  )
  const botTyping = data?.botTyping
  const messageCount = data?.messages.length ?? 0

  const { value, updateLocalStorageItem } = useLocalStorage<Record<string, boolean>>({
    key: CHAT_PRIVACY_POLICIES_STORAGE_KEY,
    initialValue: {},
  })
  const privacyPolicyAccepted = value[region.code] ?? false
  const acceptCustomPrivacyPolicy = () => updateLocalStorageItem({ ...value, [region.code]: true })

  useEffect(() => {
    if (!isBrowserTabActive || messageCount === 0) {
      return undefined
    }
    const interval = setInterval(refreshMessages, botTyping ? TYPING_POLLING_INTERVAL : DEFAULT_POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [refreshMessages, isBrowserTabActive, messageCount, botTyping])

  const submitMessage = async (message: string) => {
    const { data, error } = await createSendChatMessageEndpoint(cmsApiBaseUrl).request({
      regionCode: region.code,
      language: languageCode,
      message,
      deviceId: chatId,
    })

    if (data !== null) {
      setData(data)
    }

    if (error !== null) {
      setSendingError(error)
    }
  }

  return (
    <Chat
      region={region}
      messages={data?.messages ?? []}
      submitMessage={submitMessage}
      // If no message has been sent yet, fetching the messages yields a 404 not found error
      hasError={!!sendingError || (error !== null && !(error instanceof NotFoundError))}
      isLoading={isPending}
      isTyping={botTyping ?? false}
      privacyPolicyAccepted={privacyPolicyAccepted}
      acceptPrivacyPolicy={acceptCustomPrivacyPolicy}
      languageCode={languageCode}
    />
  )
}

export default ChatController
