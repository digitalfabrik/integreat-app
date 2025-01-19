import CheckBox from '@react-native-community/checkbox'
import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components/native'

import openExternalUrl from '../../utils/openExternalUrl'
import Link from '../Link'
import { SnackbarType } from '../SnackbarContainer'

const FlexContainer = styled.Pressable`
  display: flex;
  flex: 1;
`

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.linkColor};
  text-decoration: underline solid ${props => props.theme.colors.linkColor};
  align-self: center;
`

const StyledCheckbox = styled(CheckBox)`
  cursor: pointer;
  accent-color: ${props => props.theme.colors.themeColor};
  width: 16px;
  height: 16px;
  align-self: end;
`

const StyledLabel = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  padding: 4px;
  cursor: pointer;
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
  label: string | ReactElement
  id: string
  link?: string
  showSnackbar: (snackbar: SnackbarType) => void
}

const Checkbox = ({ checked, setChecked, label, id, link, showSnackbar }: CheckboxProps): ReactElement => (
  <FlexContainer onPress={() => setChecked(!checked)}>
    <StyledLabel htmlFor={id}>
      {typeof label !== 'string' ? (
        { label }
      ) : (
        <Trans i18nKey={label}>
          This gets replaced
          <StyledLink to={link} onPress={() => openExternalUrl(link.toString(), showSnackbar)}>
            by react-i18next
          </StyledLink>
        </Trans>
      )}
    </StyledLabel>
    <FlexEnd>
      <StyledCheckbox id={id} disabled={false} value={checked} onValueChange={() => setChecked(!checked)} />
    </FlexEnd>
  </FlexContainer>
)

export default Checkbox
