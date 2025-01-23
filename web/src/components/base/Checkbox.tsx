import React, { ReactElement } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex: 1;
`

const StyledCheckbox = styled.input`
  cursor: pointer;
  accent-color: ${props => props.theme.colors.themeColor};
  width: 16px;
  height: 16px;
  align-self: center;
`

const StyledLabel = styled.label`
  color: ${props => props.theme.colors.textColor};
  padding: 4px;
  cursor: pointer;
`

const FlexEnd = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`

type CheckboxProps = {
  checked: boolean
  setChecked: (checked: boolean) => void
  label: string | ReactElement
  id: string
}

const Checkbox = ({ checked, setChecked, label, id }: CheckboxProps): ReactElement => (
  <Container>
    <StyledLabel htmlFor={id}>{label}</StyledLabel>
    <FlexEnd>
      <StyledCheckbox type='checkbox' id={id} checked={checked} onChange={() => setChecked(!checked)} />
    </FlexEnd>
  </Container>
)

export default Checkbox
