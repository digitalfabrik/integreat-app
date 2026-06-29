import { useNetInfo } from '@react-native-community/netinfo'
import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useEffect } from 'react'

import { ChatRouteType, uuid } from 'shared'
import { createChatMessagesEndpoint, ErrorCode, loadFromEndpoint } from 'shared/api'

import Failure from '../components/Failure'
import ProgressSpinner from '../components/ProgressSpinner'
import WebView from '../components/WebView'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import useLoadRegionContent from '../hooks/useLoadRegionContent'
import useRegionAppContext from '../hooks/useRegionAppContext'
import { determineApiUrl } from '../utils/helpers'
import { captureError } from '../utils/sentry'
import { getChatUrl } from '../utils/url'

type ChatProps = {
  route: RouteProps<ChatRouteType>
  navigation: NavigationProps<ChatRouteType>
}

const Chat = ({ route, navigation }: ChatProps): ReactElement => {
  const { isConnected } = useNetInfo()
  const { regionCode, languageCode, settings, updateChatSettings } = useRegionAppContext()
  const { data } = useLoadRegionContent({ regionCode, languageCode })
  const chatSettings = settings.chat[regionCode]

  const chatUrl = getChatUrl({ regionCode, languageCode, chatId: chatSettings?.id })
  const availableLanguages = data?.languages.map(it => it.code)

  useHeader({ navigation, route, data, availableLanguages })

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

  if (isConnected === false) {
    return <Failure code={ErrorCode.NetworkConnectionFailed} retry={null} />
  }

  if (!chatSettings) {
    return <ProgressSpinner />
  }

  return <WebView source={{ uri: chatUrl }} />
}

export default Chat
