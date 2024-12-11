import React, { ReactElement } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import Pressable from './Pressable'

const StyledPressable = styled(Pressable)`
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.backgroundColor};
`

type IconButtonProps = {
  accessibilityLabel: string
  icon: ReactElement
  onPress: () => unknown
  style?: StyleProp<ViewStyle>
}

const IconButton = ({ accessibilityLabel, icon, onPress, style }: IconButtonProps): ReactElement => (
  <StyledPressable onPress={onPress} style={style} accessibilityLabel={accessibilityLabel} role='button'>
    <View>{icon}</View>
  </StyledPressable>
)

export default IconButton
