import React, { ReactElement } from 'react'
import { Switch } from 'react-native'

import { ThemeType } from 'build-configs/ThemeType'

type PropsType = {
  theme: ThemeType
  onPress: () => void
  value: boolean
}

const SettingsSwitch = ({ value, theme, onPress }: PropsType): ReactElement => (
  <Switch
    thumbColor={theme.colors.themeColor}
    trackColor={{
      true: theme.colors.themeColor,
      false: theme.colors.textSecondaryColor
    }}
    value={value}
    onValueChange={onPress}
    accessibilityRole='switch'
  />
)

export default SettingsSwitch
