import CheckBox from '@react-native-community/checkbox'
import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

const StyledCheckbox = styled(CheckBox)`
  cursor: pointer;
  accent-color: ${props => props.theme.colors.themeColor};
  width: 16px;
  height: 16px;
  align-self: end;
`

const FlexEnd = styled.View`
  display: flex;
  flex-direction: row;
  flex: 1;
  right: 12px;
  justify-content: flex-end;
`

type CheckboxProps = {
  checked: boolean
  setChecked: (checked: boolean) => void
}

const Checkbox = ({ checked, setChecked }: CheckboxProps): ReactElement => (
  <FlexEnd>
    <StyledCheckbox disabled={false} value={checked} onValueChange={() => setChecked(!checked)} />
  </FlexEnd>
)

export default Checkbox
