import React, { ReactElement } from 'react'
import { Switch } from 'react-native'

import { ThemeType } from 'build-configs/ThemeType'

type PropsType = {
  theme: ThemeType
  onPress: () => void
  value: boolean
  accessibilityLabel?: string
}

// should be used for switches on the settings page
const SettingsSwitch = ({ value, theme, onPress, accessibilityLabel }: PropsType): ReactElement => (
  <Switch
    thumbColor={theme.colors.themeColor}
    trackColor={{
      true: theme.colors.themeColorLight,
      false: theme.colors.textSecondaryColor
    }}
    value={value}
    onValueChange={onPress}
    accessibilityLabel={accessibilityLabel}
  />
)

export default SettingsSwitch
