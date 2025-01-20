import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import openExternalUrl from '../utils/openExternalUrl'
import Link from './Link'
import { SnackbarType } from './SnackbarContainer'
import Checkbox from './base/Checkbox'

const FlexContainer = styled.Pressable`
  display: flex;
  flex: 1;
`

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.linkColor};
  text-decoration: underline solid ${props => props.theme.colors.linkColor};
  align-self: center;
`

const StyledLabel = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  padding: 4px;
  cursor: pointer;
`

type PrivacyCheckboxProps = {
  checked: boolean
  setChecked: (checked: boolean) => void
  showSnackbar: (snackbar: SnackbarType) => void
}

const PrivacyCheckbox = ({ checked, setChecked, showSnackbar }: PrivacyCheckboxProps): ReactElement => {
  const { t } = useTranslation('common')
  const link = 'https://integreat-app.de/datenschutz/'
  return (
    <FlexContainer onPress={() => setChecked(!checked)}>
      <StyledLabel>
        <Trans i18nKey='common:privacyAgreement'>
          This gets replaced
          <StyledLink url={link} onPress={() => openExternalUrl(link, showSnackbar)} text={t('privacyAgreementLink')}>
            by react-i18next
          </StyledLink>
        </Trans>
      </StyledLabel>
      <Checkbox checked={checked} setChecked={setChecked} />
    </FlexContainer>
  )
}

export default PrivacyCheckbox
