import React, { ReactElement, ReactNode } from 'react'
import { RadioButton as PaperRadioButton } from 'react-native-paper'
import styled from 'styled-components/native'

import Pressable from './Pressable'

const Container = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
`

type RadioButtonProps = {
  children: ReactNode
  selected: boolean
  select: () => void
}

const RadioButton = ({ children, selected, select }: RadioButtonProps): ReactElement => (
  <Container onPress={select} role='radio'>
    <PaperRadioButton value='' status={selected ? 'checked' : 'unchecked'} onPress={select} />
    {children}
  </Container>
)

export default RadioButton
