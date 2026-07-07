import React, { ReactElement } from 'react'
import { Switch as RNSwitch, SwitchProps } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

const Switch = (props: SwitchProps): ReactElement => {
  const theme = useTheme()
  // ios_backgroundColor sets the OFF-state track color on iOS. outline rendered too subtle to tell
  // an off switch from an on one, so use onSurfaceVariant, a clearly visible gray.
  return <RNSwitch ios_backgroundColor={theme.colors.onSurfaceVariant} {...props} />
}

export default Switch
