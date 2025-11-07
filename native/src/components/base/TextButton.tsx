import React, { ReactElement } from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import Pressable from './Pressable'
import Text from './Text'

const StyledPressable = styled(Pressable)<{ primary: boolean; disabled: boolean }>`
  padding: 8px;
  border-radius: 8px;
  background-color: ${props => {
    const buttonColor = props.primary ? props.theme.legacy.colors.themeColor : props.theme.legacy.colors.backgroundColor
    return props.disabled ? props.theme.legacy.colors.textDecorationColor : buttonColor
  }};
`

const StyledText = styled(Text)`
  color: ${props =>
    props.theme.legacy.isContrastTheme
      ? props.theme.legacy.colors.backgroundColor
      : props.theme.legacy.colors.textColor};
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
  textStyle?: StyleProp<TextStyle>
}

const TextButton = ({
  text,
  onPress,
  disabled = false,
  type = 'primary',
  style,
  textStyle,
}: TextButtonProps): ReactElement => (
  <StyledPressable onPress={onPress} primary={type === 'primary'} disabled={disabled} style={style} role='button'>
    <StyledText style={textStyle}>{text}</StyledText>
  </StyledPressable>
)

export default TextButton
