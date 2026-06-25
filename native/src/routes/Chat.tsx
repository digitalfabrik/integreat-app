import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useEffect } from 'react'

import { CATEGORIES_ROUTE, regionContentPath, uuid } from 'shared'
import { createChatMessagesEndpoint, loadFromEndpoint } from 'shared/api'

import ProgressSpinner from '../components/ProgressSpinner'
import WebView from '../components/WebView'
import useRegionAppContext from '../hooks/useRegionAppContext'
import { determineApiUrl } from '../utils/helpers'
import { captureError } from '../utils/sentry'
import urlFromRouteInformation from '../utils/url'

const Chat = (): ReactElement => {
  const { regionCode, languageCode, settings, updateChatSettings } = useRegionAppContext()
  const chatSettings = settings.chat[regionCode]

  const chatUrl = urlFromRouteInformation({
    route: CATEGORIES_ROUTE,
    regionCode,
    languageCode,
    chat: true,
    chatId: chatSettings?.id,
    regionContentPath: regionContentPath({ regionCode, languageCode }),
  })

  useEffect(() => {
    if (!chatSettings) {
      updateChatSettings({ seenMessages: 0, id: uuid() })
    }
  }, [chatSettings, updateChatSettings])

  const chatId = chatSettings?.id ?? uuid()

  useFocusEffect(
    useCallback(
      () => () =>
        loadFromEndpoint(createChatMessagesEndpoint, determineApiUrl, { regionCode, languageCode, chatId })
          .then(({ messages }) =>
            updateChatSettings({ seenMessages: messages.filter(message => !message.userIsAuthor).length }),
          )
          .catch(captureError),
      [chatId, regionCode, languageCode, updateChatSettings],
    ),
  )

  if (!chatSettings) {
    return <ProgressSpinner />
  }

  return <WebView source={{ uri: chatUrl }} domStorageEnabled />
}

export default Chat
