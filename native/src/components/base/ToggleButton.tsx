import React, { ReactElement } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import Pressable from './Pressable'
import Text from './Text'

const StyledPressable = styled(Pressable)<{ active: boolean }>`
  background-color: ${props => (props.active ? props.theme.colors.secondary : props.theme.colors.background)};
  padding: 8px;
  align-items: center;
  width: 100px;
  height: 80px;
  border-radius: 18px;
  elevation: 5;
  shadow-color: ${props => props.theme.colors.onSurface};
  shadow-offset: 0 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  justify-content: space-around;
`

const StyledText = styled(Text)<{ active: boolean }>`
  font-size: 12px;
  color: ${props =>
    props.active && props.theme.dark ? props.theme.colors.background : props.theme.colors.onSurfaceVariant};
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  text-align: center;
  width: 84px;
`

type TextButtonProps = {
  text: string
  onPress: () => Promise<void> | void
  Icon: ReactElement
  active: boolean
  style?: StyleProp<ViewStyle>
}

const ToggleButton = ({ text, onPress, Icon, active, style }: TextButtonProps): ReactElement => (
  <StyledPressable role='switch' active={active} onPress={onPress} style={style}>
    {Icon}
    <StyledText active={active} numberOfLines={1}>
      {text}
    </StyledText>
  </StyledPressable>
)

export default ToggleButton
