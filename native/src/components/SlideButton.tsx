import React, { ReactElement } from 'react'
import { Button } from 'react-native-elements'

import { ThemeType } from 'build-configs'

type SlideButtonPropsType = {
  label: string
  onPress: () => void | Promise<void>
  theme: ThemeType
  highlighted?: boolean
}

const SlideButton = ({ label, onPress, theme, highlighted }: SlideButtonPropsType): ReactElement => (
  <Button
    type={highlighted ? 'solid' : 'clear'}
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
      backgroundColor: highlighted ? theme.colors.themeColor : theme.colors.backgroundColor,
    }}
  />
)

export default SlideButton
