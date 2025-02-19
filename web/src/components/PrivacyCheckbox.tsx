import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

import buildConfig from '../constants/buildConfig'
import Checkbox from './base/Checkbox'

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
          <Link to={privacyUrl}>by react-i18next</Link>
        </Trans>
      }
    />
  )
}

export default PrivacyCheckbox
