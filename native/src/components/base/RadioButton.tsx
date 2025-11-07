import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components/native'

import Pressable from './Pressable'

const Container = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
`

const Ring = styled.View<{ selected: boolean }>`
  height: 24px;
  width: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${props => {
    if (!props.selected) {
      return props.theme.legacy.colors.textSecondaryColor
    }
    return props.theme.legacy.isContrastTheme
      ? props.theme.legacy.colors.themeColor
      : props.theme.legacy.colors.textColor
  }};
  align-items: center;
  justify-content: center;
`

const Marker = styled.View`
  height: 14px;
  width: 14px;
  border-radius: 7px;
  background-color: ${props =>
    props.theme.legacy.isContrastTheme ? props.theme.legacy.colors.themeColor : props.theme.legacy.colors.textColor};
`

type RadioButtonProps = {
  children: ReactNode
  selected: boolean
  select: () => void
}

const RadioButton = ({ children, selected, select }: RadioButtonProps): ReactElement => (
  <Container onPress={select} role='radio'>
    <Ring selected={selected}>{selected && <Marker />}</Ring>
    {children}
  </Container>
)

export default RadioButton
