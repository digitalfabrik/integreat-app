import React, { ReactElement } from 'react'
import { Button } from 'react-native-elements'

import { ThemeType } from 'build-configs'

type SlideButtonProps = {
  label: string
  onPress: () => void | Promise<void>
  theme: ThemeType
}

const SlideButton = ({ label, onPress, theme }: SlideButtonProps): ReactElement => (
  <Button
    type='clear'
    title={label}
    onPress={onPress}
    titleStyle={{
      color: theme.colors.textColor,
    }}
    containerStyle={{
      flex: 1,
      margin: 0,
    }}
    buttonStyle={{
      margin: 0,
      backgroundColor: theme.colors.backgroundColor,
    }}
  />
)

export default SlideButton
