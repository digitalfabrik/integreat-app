import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import buildConfig from '../constants/buildConfig'
import openExternalUrl from '../utils/openExternalUrl'
import Link from './Link'
import { SnackbarType } from './SnackbarContainer'
import Checkbox from './base/Checkbox'

const FlexContainer = styled.Pressable`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  margin-top: 12px;
`

const StyledLabel = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  cursor: pointer;
`

type PrivacyCheckboxProps = {
  language: string
  checked: boolean
  setChecked: (checked: boolean) => void
  showSnackbar: (snackbar: SnackbarType) => void
}

const PrivacyCheckbox = ({ language, checked, setChecked, showSnackbar }: PrivacyCheckboxProps): ReactElement => {
  const { privacyUrls } = buildConfig()
  const { t } = useTranslation('common')
  const privacyUrl = privacyUrls[language] || privacyUrls.default
  return (
    <FlexContainer onPress={() => setChecked(!checked)}>
      <Checkbox checked={checked} setChecked={setChecked} />
      <StyledLabel>
        <Trans i18nKey='common:privacyPolicy'>
          This gets replaced
          <Link url={privacyUrl} onPress={() => openExternalUrl(link, showSnackbar)} text={t('privacyPolicyLink')}>
            by react-i18next
          </Link>
        </Trans>
      </StyledLabel>
    </FlexContainer>
  )
}

export default PrivacyCheckbox
