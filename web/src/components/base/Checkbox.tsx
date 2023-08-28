import React, { ReactElement } from 'react'
import styled from 'styled-components'

const StyledCheckbox = styled.input`
  cursor: pointer;
  accent-color: ${props => props.theme.colors.themeColor};
`

type CheckboxProps = {
  checked: boolean
  setChecked: (checked: boolean) => void
}

const Checkbox = ({ checked, setChecked }: CheckboxProps): ReactElement => (
  <StyledCheckbox type='checkbox' checked={checked} onChange={() => setChecked(!checked)} />
)

export default Checkbox
