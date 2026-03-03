import React, { ReactElement } from 'react'
import { Switch as RNSwitch, SwitchProps } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

const Switch = (props: SwitchProps): ReactElement => {
  const theme = useTheme()
  return <RNSwitch ios_backgroundColor={theme.colors.outline} {...props} />
}

export default Switch
