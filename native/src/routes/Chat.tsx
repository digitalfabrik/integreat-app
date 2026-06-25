import React, { ReactElement, useEffect } from 'react'

import { CATEGORIES_ROUTE, regionContentPath } from 'shared'

import ProgressSpinner from '../components/ProgressSpinner'
import WebView from '../components/WebView'
import useRegionAppContext from '../hooks/useRegionAppContext'
import { defaultChatRegionSettings } from '../utils/AppSettings'
import urlFromRouteInformation from '../utils/url'

const Chat = (): ReactElement => {
  const { regionCode, languageCode, settings, updateSettings } = useRegionAppContext()
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
      updateSettings({ chat: { ...settings.chat, [regionCode]: defaultChatRegionSettings } })
    }
  }, [chatSettings, settings, regionCode, updateSettings])

  if (!chatSettings) {
    return <ProgressSpinner />
  }

  return <WebView source={{ uri: chatUrl }} domStorageEnabled />
}

export default Chat
