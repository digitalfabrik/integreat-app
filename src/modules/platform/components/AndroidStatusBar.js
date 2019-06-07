// @flow

import * as React from 'react'
import type { ThemeType } from '../../theme/constants/theme'
import { StatusBar } from 'react-native'

type PropsType = {|
  theme: ThemeType
|}

class AndroidStatusBar extends React.PureComponent<PropsType> {
  render () {
    return (
      <StatusBar backgroundColor={this.props.theme.colors.backgroundAccentColor} barStyle='dark-content' />
    )
  }
}

export default AndroidStatusBar
