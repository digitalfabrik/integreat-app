import React, { ReactElement } from 'react'
import { StatusBar as ReactNativeStatusBar } from 'react-native'

import { ThemeType } from 'build-configs'

type PropsType = {
  theme: ThemeType
}

const StatusBar = ({ theme }: PropsType): ReactElement => (
  <ReactNativeStatusBar backgroundColor={theme.colors.backgroundAccentColor} barStyle='dark-content' />
)

export default StatusBar
