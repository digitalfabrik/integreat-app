// @flow

import React from 'react'
import { Button } from 'react-native-elements'
import type { ThemeType } from '../../../modules/theme/constants'

type PropsType = {|
  label: string,
  onPress: () => void | Promise<void>,
  theme: ThemeType,
  highlighted?: boolean
|}

class SlideButton extends React.Component<PropsType> {
  render() {
    const { label, onPress, theme, highlighted } = this.props
    return (
      <Button
        type={highlighted ? 'solid' : 'clear'}
        title={label}
        borderless
        onPress={onPress}
        titleStyle={{ color: theme.colors.textColor }}
        containerStyle={{ flex: 1, margin: 0 }}
        buttonStyle={{
          margin: 0,
          backgroundColor: highlighted ? theme.colors.themeColor : theme.colors.backgroundColor
        }}
      />
    )
  }
}

export default SlideButton
