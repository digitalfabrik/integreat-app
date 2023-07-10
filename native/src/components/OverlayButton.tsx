import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { CloseIcon } from '../assets'
import Text from './base/Text'

const Container = styled.Pressable`
  flex: 1;
  flex-direction: row;
  height: 30px;
  padding: 4px 8px;
  align-items: center;
  margin: 0 2px;
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

type OverlayButtonProps = {
  text: string
  Icon: React.JSXElementConstructor<SVGElement>
  onPress: () => void
  closeButton?: boolean
}

const OverlayButton = ({ Icon, text, onPress, closeButton }: OverlayButtonProps): ReactElement => (
  <Container onPress={onPress}>
    <IconContainer>
      <Icon />
    </IconContainer>
    <StyledText>{text}</StyledText>
    {closeButton && (
      <IconContainer>
        <CloseIcon />
      </IconContainer>
    )}
  </Container>
)

export default OverlayButton
