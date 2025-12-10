import React, { ReactElement } from 'react'
import { StatusBar as ReactNativeStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

const StatusBarContainer = styled.View`
  background-color: ${props => props.theme.colors.surface};
`

const StatusBar = (): ReactElement => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <StatusBarContainer style={{ height: insets.top }}>
      <ReactNativeStatusBar backgroundColor={theme.colors.surface} barStyle={theme.dark ? 'default' : 'dark-content'} />
    </StatusBarContainer>
  )
}

export default StatusBar
