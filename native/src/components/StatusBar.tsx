import React, { ReactElement } from 'react'
import { StatusBar as ReactNativeStatusBar } from 'react-native'
import { useTheme } from 'styled-components'

const StatusBar = (): ReactElement => {
  const theme = useTheme()
  return <ReactNativeStatusBar backgroundColor={theme.colors.backgroundAccentColor} barStyle='dark-content' />
}

export default StatusBar
