import React, { ReactElement } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { TouchableRipple, useTheme } from 'react-native-paper'
import { DefaultTheme } from 'styled-components/native'

import Text from './Text'

const styles = StyleSheet.create({
  surface: {
    borderRadius: 18,
    width: 100,
    height: 80,
  },
  TouchableRippleStyle: {
    padding: 8,
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    justifyContent: 'space-around',
    borderWidth: 1,
  },
  text: {
    textAlign: 'center',
    width: 84,
  },
})

type ToggleButtonProps = {
  text: string
  onPress: () => Promise<void> | void
  icon: ReactElement
  active: boolean
  style?: StyleProp<ViewStyle>
}

const ToggleButton = ({ text, onPress, icon, active, style }: ToggleButtonProps): ReactElement => {
  const theme = useTheme() as DefaultTheme

  return (
    <View style={[styles.surface, { backgroundColor: active ? theme.colors.primary : theme.colors.background }, style]}>
      <TouchableRipple
        role='button'
        onPress={onPress}
        style={[styles.TouchableRippleStyle, { borderColor: theme.colors.onBackground }]}
        borderless
        accessibilityState={{ selected: active }}>
        <>
          {icon}
          <Text
            variant='body3'
            numberOfLines={1}
            style={[styles.text, { color: active ? theme.colors.onPrimary : theme.colors.onSurface }]}>
            {text}
          </Text>
        </>
      </TouchableRipple>
    </View>
  )
}

export default ToggleButton
