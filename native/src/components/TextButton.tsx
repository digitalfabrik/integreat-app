import React, { ReactElement } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { Button } from 'react-native-elements'
import styled, { useTheme } from 'styled-components/native'

import Text from './base/Text'

const TileButton = styled.Pressable<{ active: boolean }>`
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

type ButtonSpecificProps =
  | {
      type: 'primary' | 'clear'
      disabled?: boolean
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
  const theme = useTheme()

  switch (props.type) {
    case 'tile':
      return (
        <TileButton active={props.active} onPress={onPress} style={style}>
          {props.Icon}
          <TileButtonText>{text}</TileButtonText>
        </TileButton>
      )

    default:
      return (
        <Button
          onPress={onPress}
          title={text}
          disabled={props.disabled}
          titleStyle={{
            color: theme.colors.textColor,
          }}
          buttonStyle={{
            backgroundColor: props.type === 'primary' ? theme.colors.themeColor : theme.colors.backgroundColor,
            borderRadius: 8,
          }}
        />
      )
  }
}

export default TextButton
