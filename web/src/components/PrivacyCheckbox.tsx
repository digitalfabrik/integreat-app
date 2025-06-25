import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import Checkbox from './base/Checkbox'
import Link from './base/Link'

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
          <Link to={privacyUrl} highlighted>
            by react-i18next
          </Link>
        </Trans>
      }
    />
  )
}

export default PrivacyCheckbox
