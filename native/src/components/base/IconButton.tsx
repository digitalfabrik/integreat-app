import React, { ReactElement } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { TouchableRipple, useTheme } from 'react-native-paper'
import { DefaultTheme } from 'styled-components/native'

type IconButtonProps = {
  accessibilityLabel: string
  icon: ReactElement
  onPress: () => unknown
  style?: StyleProp<ViewStyle>
  disabled?: boolean
}

const styles = StyleSheet.create({
  TouchableRippleStyle: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
})

const IconButton = ({ accessibilityLabel, icon, onPress, style, disabled }: IconButtonProps): ReactElement => {
  const theme = useTheme() as DefaultTheme
  return (
    <TouchableRipple
      onPress={onPress}
      style={[
        styles.TouchableRippleStyle,
        { backgroundColor: disabled ? theme.colors.onSurfaceDisabled : theme.colors.background },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      role='button'
      disabled={disabled}>
      <View>{icon}</View>
    </TouchableRipple>
  )
}

export default IconButton
