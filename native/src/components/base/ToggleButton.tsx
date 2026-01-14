import React, { ReactElement } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import Pressable from './Pressable'
import Text from './Text'

const StyledPressable = styled(Pressable)<{ active: boolean }>`
  background-color: ${props => {
    if (props.theme.dark && props.active) {
      return props.theme.colors.primary
    }
    if (props.active) {
      return props.theme.colors.primaryContainer
    }
    return props.theme.colors.background
  }};
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

type TextButtonProps = {
  text: string
  onPress: () => Promise<void> | void
  Icon: ReactElement
  active: boolean
  style?: StyleProp<ViewStyle>
}

const ToggleButton = ({ text, onPress, Icon, active, style }: TextButtonProps): ReactElement => {
  const theme = useTheme()

  const getTextColor = () => {
    if (theme.dark) {
      return theme.colors.onPrimary
    }
    return active ? theme.colors.primary : theme.colors.onSurface
  }

  return (
    <StyledPressable role='switch' active={active} onPress={onPress} style={style}>
      {Icon}
      <Text
        variant='body3'
        numberOfLines={1}
        style={{
          color: getTextColor(),
          textAlign: 'center',
          width: 84,
        }}>
        {text}
      </Text>
    </StyledPressable>
  )
}

export default ToggleButton
