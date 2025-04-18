import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import buildConfig from '../constants/buildConfig'
import Checkbox from './base/Checkbox'

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
    <Checkbox
      id='privacyPolicy'
      checked={checked}
      setChecked={setChecked}
      label={
        <Trans i18nKey='common:privacyPolicy'>
          This gets replaced
          <StyledLink to={privacyUrl}>by react-i18next</StyledLink>
        </Trans>
      }
    />
  )
}

export default PrivacyCheckbox
