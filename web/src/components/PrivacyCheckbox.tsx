import Typography from '@mui/material/Typography'
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
      checked={checked}
      setChecked={setChecked}
      label={
        <Typography variant='body2'>
          <Trans i18nKey='common:privacyPolicy'>
            This gets replaced
            <Link to={privacyUrl} highlighted>
              by react-i18next
            </Link>
          </Trans>
        </Typography>
      }
    />
  )
}

export default PrivacyCheckbox
