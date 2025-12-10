import React, { ReactElement } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import Pressable from './Pressable'

const StyledPressable = styled(Pressable)<{ disabled?: boolean }>`
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: ${props => (props.disabled ? props.theme.colors.onSurfaceDisabled : props.theme.colors.background)};
`

type IconButtonProps = {
  accessibilityLabel: string
  icon: ReactElement
  onPress: () => unknown
  style?: StyleProp<ViewStyle>
  disabled?: boolean
}

const IconButton = ({ accessibilityLabel, icon, onPress, style, disabled }: IconButtonProps): ReactElement => (
  <StyledPressable
    onPress={onPress}
    style={style}
    accessibilityLabel={accessibilityLabel}
    role='button'
    disabled={disabled}>
    <View>{icon}</View>
  </StyledPressable>
)

export default IconButton
