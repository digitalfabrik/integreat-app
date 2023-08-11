import React, { ReactElement } from 'react'
import { Switch } from 'react-native'
import { useTheme } from 'styled-components'

type SettingsSwitchProps = {
  onPress: (value: boolean) => void
  value: boolean
}

const SettingsSwitch = ({ value, onPress }: SettingsSwitchProps): ReactElement => {
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
