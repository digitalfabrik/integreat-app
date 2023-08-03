import React, { ReactElement } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { CloseIcon } from '../assets'
import Text from './base/Text'

const TileButton = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${props => (props.active ? props.theme.colors.themeColor : props.theme.colors.backgroundColor)};
  padding: 8px;
  align-items: center;
  width: 100px;
  height: 80px;
  border-radius: 18px;
  elevation: 5;
  shadow-color: ${props => props.theme.colors.textColor};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  justify-content: space-around;
`

const TileButtonText = styled(Text)`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

const OverlayButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  height: 30px;
  padding: 4px 8px;
  align-items: center;
  margin: 0 4px;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const OverlayButtonIconContainer = styled.View`
  height: 16px;
  width: 16px;
`

const OverlayButtonText = styled(Text)`
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

const OverlayButtonSpacer = styled.View`
  width: 4px;
`

const Button = styled.TouchableOpacity<{ primary: boolean; disabled: boolean }>`
  padding: 8px;
  border-radius: 8px;
  background-color: ${props => {
    const buttonColor = props.primary ? props.theme.colors.themeColor : props.theme.colors.backgroundColor
    return props.disabled ? props.theme.colors.textDecorationColor : buttonColor
  }};
`

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-weight: 500;
  font-size: 18px;
  text-align: center;
`

type ButtonSpecificProps =
  | {
      type: 'primary' | 'clear'
      disabled?: boolean
    }
  | {
      type: 'overlay'
      Icon: ReactElement
      closeButton?: boolean
    }
  | {
      type: 'tile'
      Icon: ReactElement
      active: boolean
    }

type TextButtonProps = {
  text: string
  onPress: () => Promise<void> | void
  style?: StyleProp<ViewStyle>
} & ButtonSpecificProps

const TextButton = ({ text, onPress, style, ...props }: TextButtonProps): ReactElement => {
  switch (props.type) {
    case 'tile':
      return (
        <TileButton active={props.active} onPress={onPress} style={style}>
          {props.Icon}
          <TileButtonText>{text}</TileButtonText>
        </TileButton>
      )

    case 'overlay':
      return (
        <OverlayButton onPress={onPress} style={style}>
          <OverlayButtonIconContainer>{props.Icon}</OverlayButtonIconContainer>
          <OverlayButtonSpacer />
          <OverlayButtonText>{text}</OverlayButtonText>
          {props.closeButton && (
            <OverlayButtonIconContainer>
              <CloseIcon />
            </OverlayButtonIconContainer>
          )}
        </OverlayButton>
      )

    default:
      return (
        <Button onPress={onPress} primary={props.type === 'primary'} disabled={!!props.disabled} style={style}>
          <ButtonText>{text}</ButtonText>
        </Button>
      )
  }
}

export default TextButton
