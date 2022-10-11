import React, { ReactElement } from 'react'
import { Switch } from 'react-native'
import { useTheme } from 'styled-components'

type SettingsSwitchPropsType = {
  onPress: () => void
  value: boolean
}

const SettingsSwitch = ({ value, onPress }: SettingsSwitchPropsType): ReactElement => {
  const theme = useTheme()
  return (
    <Switch
      thumbColor={theme.colors.themeColor}
      trackColor={{
        true: theme.colors.themeColor,
        false: theme.colors.textSecondaryColor,
      }}
      value={value}
      onValueChange={onPress}
      accessibilityRole='switch'
    />
  )
}

export default SettingsSwitch
