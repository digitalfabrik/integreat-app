import React, { ReactElement } from 'react'
import { Pressable as RNPressable, PressableProps as RNPressableProps, Role, StyleProp, ViewStyle } from 'react-native'

const ON_PRESS_OPACITY = 0.5

type PressableProps = {
  style?: StyleProp<ViewStyle>
  role: Role
} & RNPressableProps

const Pressable = ({ style, ...props }: PressableProps): ReactElement => (
  <RNPressable {...props} style={({ pressed }) => [{ opacity: pressed ? ON_PRESS_OPACITY : 1 }, style]} />
)

export default Pressable
