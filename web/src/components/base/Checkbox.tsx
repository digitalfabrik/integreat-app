import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'
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
  noLinkInLabel?: boolean
  link?: string
  makeToLink?: string
}

const Checkbox = ({
  checked,
  setChecked,
  label,
  id,
  noLinkInLabel = true,
  link,
  makeToLink,
}: CheckboxProps): ReactElement => (
  <Container>
    <StyledLabel htmlFor={id}>{label}</StyledLabel>
    <FlexEnd>
      <StyledCheckbox
        type='checkbox'
        id={id}
        value={noLinkInLabel ? label : ''}
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      {!noLinkInLabel ? (
        <Trans i18nKey={label}>
          This gets replaced by react-i18next.
          {link ? <a href={link}>{makeToLink}</a> : <span>{makeToLink}</span>}
        </Trans>
      ) : (
        ''
      )}
    </FlexEnd>
  </Container>
)

export default Checkbox
