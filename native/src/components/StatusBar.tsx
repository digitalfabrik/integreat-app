import * as React from 'react'
import { ReactNode } from 'react'
import { StatusBar as ReactNativeStatusBar } from 'react-native'

import { ThemeType } from 'build-configs'

type PropsType = {
  theme: ThemeType
}

class StatusBar extends React.PureComponent<PropsType> {
  render(): ReactNode {
    return (
      <ReactNativeStatusBar backgroundColor={this.props.theme.colors.backgroundAccentColor} barStyle='dark-content' />
    )
  }
}

export default StatusBar
