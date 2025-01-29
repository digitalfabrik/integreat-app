import CheckBox from '@react-native-community/checkbox'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

const StyledCheckbox = styled(CheckBox)`
  cursor: pointer;
  accent-color: ${props => props.theme.colors.themeColor};
  width: 16px;
  height: 16px;
`

const Container = styled.View`
  display: flex;
  flex: 1;
`

type CheckboxProps = {
  checked: boolean
  setChecked: (checked: boolean) => void
}

const Checkbox = ({ checked, setChecked }: CheckboxProps): ReactElement => (
  <Container>
    <StyledCheckbox disabled={false} value={checked} onValueChange={() => setChecked(!checked)} />
  </Container>
)

export default Checkbox
