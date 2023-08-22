import React, { ReactElement } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import Pressable from './Pressable'
import Text from './Text'

const StyledPressable = styled(Pressable)<{ primary: boolean; disabled: boolean }>`
  padding: 8px;
  border-radius: 8px;
  background-color: ${props => {
    const buttonColor = props.primary ? props.theme.colors.themeColor : props.theme.colors.backgroundColor
    return props.disabled ? props.theme.colors.textDecorationColor : buttonColor
  }};
`

const StyledText = styled(Text)`
  color: ${props => props.theme.colors.textColor};
  font-weight: 500;
  font-size: 18px;
  text-align: center;
`

type TextButtonProps = {
  text: string
  onPress: () => Promise<void> | void
  disabled?: boolean
  type?: 'primary' | 'clear'
  style?: StyleProp<ViewStyle>
}

const TextButton = ({ text, onPress, disabled = false, type = 'primary', style }: TextButtonProps): ReactElement => (
  <StyledPressable onPress={onPress} primary={type === 'primary'} disabled={disabled} style={style}>
    <StyledText>{text}</StyledText>
  </StyledPressable>
)

export default TextButton
