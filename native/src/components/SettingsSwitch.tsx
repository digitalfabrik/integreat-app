import React, { ReactElement } from 'react'
import { Switch } from 'react-native'

import { ThemeType } from 'build-configs/ThemeType'

type PropsType = {
  theme: ThemeType
  onPress: () => void
  value: boolean
  testID?: string
}

// should be used for switches on the settings page
const SettingsSwitch = ({ value, theme, onPress, testID }: PropsType): ReactElement => (
  <Switch
    thumbColor={theme.colors.themeColor}
    trackColor={{
      true: theme.colors.themeColorLight,
      false: theme.colors.textSecondaryColor
    }}
    value={value}
    onValueChange={onPress}
    testID={testID}
  />
)

export default SettingsSwitch
