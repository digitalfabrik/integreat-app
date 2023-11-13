import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components/native'

const Container = styled.Pressable`
  flex-direction: row;
  align-items: center;
`

const Ring = styled.View<{ selected: boolean }>`
  height: 24px;
  width: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${props => (props.selected ? props.theme.colors.textColor : props.theme.colors.textSecondaryColor)};
  align-items: center;
  justify-content: center;
  margin: 16px;
`

const Marker = styled.View`
  height: 14px;
  width: 14px;
  border-radius: 7px;
  background-color: ${props => props.theme.colors.textColor};
`

type RadioButtonProps = {
  text: ReactNode
  selected: boolean
  select: () => void
}

const RadioButton = ({ text, selected, select }: RadioButtonProps): ReactElement => (
  <Container onPress={select}>
    <Ring selected={selected}>{selected && <Marker />}</Ring>
    {text}
  </Container>
)

export default RadioButton
