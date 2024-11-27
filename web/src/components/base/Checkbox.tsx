import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
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
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.web.decorativeFont};
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
  label: string
  id: string
  link?: string
  makeToLink?: string
}

const Checkbox = ({ checked, setChecked, label, id, link }: CheckboxProps): ReactElement => {
  return (
    <Container>
      <StyledLabel htmlFor={id}>
        <Trans i18nKey={label}>
          This gets replaced
          {link ? <Link to={link}>by react-i18next</Link> : <span>test</span>}
        </Trans>
      </StyledLabel>
      <FlexEnd>
        <StyledCheckbox type='checkbox' id={id} checked={checked} onChange={() => setChecked(!checked)} />
      </FlexEnd>
    </Container>
  )
}

export default Checkbox
