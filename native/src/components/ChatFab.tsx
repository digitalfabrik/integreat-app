import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'
import { Badge, FAB, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import { CHAT_DEFAULT_POLLING_INTERVAL, CHAT_ROUTE, getChatName } from 'shared'
import { createChatMessagesEndpoint, useLoadFromEndpoint } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useNavigate from '../hooks/useNavigate'
import useRegionAppContext from '../hooks/useRegionAppContext'
import { determineApiUrl } from '../utils/helpers'

const Container = styled.View`
  position: absolute;
  right: 0;
  margin: 16px;
`

const StyledBadge = styled(Badge)`
  position: absolute;
  top: -8px;
  right: -8px;
`

type ChatFabProps = {
  style?: ViewStyle
}

const ChatFab = ({ style }: ChatFabProps): ReactElement => {
  const { regionCode, languageCode, settings } = useRegionAppContext()
  const chatSettings = settings.chat[regionCode]
  const { navigation } = useNavigate()
  const { t } = useTranslation('chat')
  const theme = useTheme()

  const { data, refresh } = useLoadFromEndpoint(createChatMessagesEndpoint, determineApiUrl, {
    regionCode,
    languageCode,
    chatId: chatSettings?.id ?? '',
  })

  useFocusEffect(
    useCallback(() => {
      if (chatSettings) {
        const interval = setInterval(refresh, CHAT_DEFAULT_POLLING_INTERVAL)
        return () => clearInterval(interval)
      }
      return () => undefined
    }, [refresh, chatSettings]),
  )

  const incomingMessageCount = data?.messages.filter(message => !message.userIsAuthor).length ?? 0
  const unreadMessageCount = incomingMessageCount - (chatSettings?.seenMessages ?? 0)

  return (
    <Container style={style}>
      <FAB
        icon='forum-outline'
        onPress={() => navigation.navigate(CHAT_ROUTE)}
        accessibilityLabel={getChatName(buildConfig().appName)}
        variant='primary'
        style={{ backgroundColor: theme.colors.primary }}
        size='medium'
        aria-label={getChatName(buildConfig().appName)}
      />
      {unreadMessageCount > 0 && (
        <StyledBadge aria-label={t('unreadMessages', { count: unreadMessageCount })}>{unreadMessageCount}</StyledBadge>
      )}
    </Container>
  )
}

export default ChatFab
