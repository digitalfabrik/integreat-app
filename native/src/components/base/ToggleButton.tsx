import React, { ReactElement } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { Surface, TouchableRipple, useTheme } from 'react-native-paper'
import { DefaultTheme } from 'styled-components/native'

import Text from './Text'

type ToggleButtonProps = {
  text: string
  onPress: () => Promise<void> | void
  Icon: ReactElement
  active: boolean
  style?: StyleProp<ViewStyle>
}

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
  },
  text: {
    textAlign: 'center',
    width: 84,
  },
})

const ToggleButton = ({ text, onPress, Icon, active, style }: ToggleButtonProps): ReactElement => {
  const theme = useTheme() as DefaultTheme

  const getBackgroundColor = () => {
    if (theme.dark && active) {
      return theme.colors.primary
    }
    if (active) {
      return theme.colors.primaryContainer
    }
    return theme.colors.background
  }

  const getTextColor = () => {
    if (theme.dark) {
      return theme.colors.onPrimary
    }
    return active ? theme.colors.primary : theme.colors.onSurface
  }

  return (
    <Surface
      elevation={5}
      style={[
        styles.surface,
        {
          backgroundColor: getBackgroundColor(),
          shadowColor: theme.colors.onSurface,
        },
        style,
      ]}>
      <TouchableRipple role='switch' onPress={onPress} style={styles.TouchableRippleStyle} borderless>
        <>
          {Icon}
          <Text variant='body3' numberOfLines={1} style={[styles.text, { color: getTextColor() }]}>
            {text}
          </Text>
        </>
      </TouchableRipple>
    </Surface>
  )
}

export default ToggleButton
