import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components/native'

import buildConfig from '../constants/buildConfig'
import Link from './Link'
import Checkbox from './base/Checkbox'
import Pressable from './base/Pressable'
import Text from './base/Text'

const StyledPressable = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
  gap: 8px;
`

const StyledLabel = styled(Text)`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  flex: 1;
`

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.linkColor};
`

type PrivacyCheckboxProps = {
  language: string
  checked: boolean
  setChecked: (checked: boolean) => void
}

const PrivacyCheckbox = ({ language, checked, setChecked }: PrivacyCheckboxProps): ReactElement => {
  const { privacyUrls } = buildConfig()
  const privacyUrl = privacyUrls[language] || privacyUrls.default
  return (
    <StyledPressable onPress={() => setChecked(!checked)} role='checkbox'>
      <Checkbox checked={checked} setChecked={setChecked} />
      <StyledLabel>
        <Trans i18nKey='common:privacyPolicy'>
          This gets replaced
          <StyledLink url={privacyUrl}>by react-i18next</StyledLink>
        </Trans>
      </StyledLabel>
    </StyledPressable>
  )
}

export default PrivacyCheckbox
