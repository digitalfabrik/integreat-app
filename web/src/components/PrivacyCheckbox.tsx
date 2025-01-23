import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

import buildConfig from '../constants/buildConfig'
import Checkbox from './base/Checkbox'

type PrivacyCheckboxProps = {
  language: string
  checked: boolean
  setChecked: (checked: boolean) => void
  id: string
}

const PrivacyCheckbox = ({ language, checked, setChecked, id }: PrivacyCheckboxProps): ReactElement => {
  const { privacyUrls } = buildConfig()
  const privacyUrl = privacyUrls[language] || privacyUrls.default
  return (
    <Checkbox
      checked={checked}
      setChecked={setChecked}
      label={
        <Trans i18nKey='common:privacyAgreement'>
          This gets replaced
          <Link to={privacyUrl}>by react-i18next</Link>
        </Trans>
      }
      id={id}
    />
  )
}

export default PrivacyCheckbox
