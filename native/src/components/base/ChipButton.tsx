import React, { ReactElement } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { CloseIcon } from '../../assets'
import Pressable from './Pressable'
import Text from './Text'

const StyledPressable = styled(Pressable)`
  flex: 1;
  flex-direction: row;
  height: 30px;
  padding: 4px 8px;
  align-items: center;
  margin: 0 4px;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const IconContainer = styled.View`
  height: 16px;
  width: 16px;
`

const StyledText = styled(Text)`
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

const Spacer = styled.View`
  width: 4px;
`

type TextButtonProps = {
  text: string
  onPress: () => Promise<void> | void
  Icon: ReactElement
  closeButton?: boolean
  style?: StyleProp<ViewStyle>
}

const ChipButton = ({ text, onPress, Icon, closeButton, style }: TextButtonProps): ReactElement => (
  <StyledPressable onPress={onPress} style={style}>
    <IconContainer>{Icon}</IconContainer>
    <Spacer />
    <StyledText>{text}</StyledText>
    {closeButton && (
      <IconContainer>
        <CloseIcon />
      </IconContainer>
    )}
  </StyledPressable>
)

export default ChipButton
