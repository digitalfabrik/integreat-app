import React, { ReactElement } from 'react'
import { ViewStyle } from 'react-native'
import { FAB, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import { CHAT_ROUTE, getChatName } from 'shared'

import buildConfig from '../constants/buildConfig'
import useNavigate from '../hooks/useNavigate'

const StyledFab = styled(FAB)`
  position: absolute;
  right: 0;
  margin: 16px;
`

type ChatFabProps = {
  style?: ViewStyle
}

const ChatFab = ({ style }: ChatFabProps): ReactElement => {
  const { navigation } = useNavigate()
  const theme = useTheme()

  return (
    <StyledFab
      icon='forum-outline'
      onPress={() => navigation.navigate(CHAT_ROUTE)}
      accessibilityLabel={getChatName(buildConfig().appName)}
      variant='primary'
      style={{ ...style, backgroundColor: theme.colors.primary }}
      size='medium'
    />
  )
}

export default ChatFab
