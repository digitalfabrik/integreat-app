import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import Checkbox from './base/Checkbox'
import Link from './base/Link'

type PrivacyCheckboxProps = {
  language: string
  checked: boolean
  setChecked: (checked: boolean) => void
  url?: string | null
}

const PrivacyCheckbox = ({ language, checked, setChecked, url }: PrivacyCheckboxProps): ReactElement => {
  const { privacyUrls } = buildConfig()
  const privacyUrl = url ?? privacyUrls[language] ?? privacyUrls.default
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
