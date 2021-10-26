import React, { ReactElement } from 'react'
import { Switch } from 'react-native'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs/ThemeType'

type PropsType = {
  theme: ThemeType
  onPress?: () => void
  value: boolean
}

const SettingsSwitch = ({ value, theme, onPress }: PropsType): ReactElement => (
  <Switch
    thumbColor={theme.colors.themeColor}
    trackColor={{
      // TODO somehow change colors and refer to a constant
      true: theme.colors.themeColorLight,
      // true: theme.colors.themeColorLight,
      false: theme.colors.textSecondaryColor
    }}
    value={value}
    onValueChange={onPress}
  />
)

export default SettingsSwitch
