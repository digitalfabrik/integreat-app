import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

const Container = styled.div`
  display: flex;
  flex: 1;
  gap: 10px;
`

const StyledCheckbox = styled.input`
  cursor: pointer;
  accent-color: ${props => props.theme.colors.themeColor};
  width: 20px;
  height: 20px;
  min-width: 20px;
  align-self: center;
`

const StyledLabel = styled.label`
  color: ${props => props.theme.colors.textColor};
  padding: 4px;
  cursor: pointer;
`

type CheckboxProps = {
  checked: boolean
  setChecked: (checked: boolean) => void
  label: string | ReactElement
  id: string
}

const Checkbox = ({ checked, setChecked, label, id }: CheckboxProps): ReactElement => (
  <Container>
    <StyledCheckbox type='checkbox' id={id} checked={checked} onChange={() => setChecked(!checked)} />
    <StyledLabel htmlFor={id}>{label}</StyledLabel>
  </Container>
)

export default Checkbox
