import React, { ReactElement } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import Pressable from './Pressable'

const StyledPressable = styled(Pressable)<{ size: number }>`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.size / 2}px;
  background-color: ${props => props.theme.colors.backgroundColor};
`

type IconButtonProps = {
  accessibilityLabel?: string
  icon: ReactElement
  onPress: () => Promise<void> | void
  size?: number
  style?: StyleProp<ViewStyle>
}

const DEFAULT_BUTTON_SIZE = 40

const IconButton = ({
  accessibilityLabel,
  icon,
  onPress,
  size = DEFAULT_BUTTON_SIZE,
  style,
}: IconButtonProps): ReactElement => (
  <StyledPressable onPress={onPress} style={style} size={size} accessibilityLabel={accessibilityLabel}>
    <View>{icon}</View>
  </StyledPressable>
)

export default IconButton
