import Typography from '@mui/material/Typography'
import { SelectorParam } from 'i18next'
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
  i18nKey?: SelectorParam
}

const PrivacyCheckbox = ({
  language,
  checked,
  setChecked,
  url,
  i18nKey = $ => $.common.privacy.confirmation,
}: PrivacyCheckboxProps): ReactElement => {
  const { privacyUrls } = buildConfig()
  const privacyUrl = url ?? privacyUrls[language] ?? privacyUrls.default
  return (
    <Checkbox
      checked={checked}
      setChecked={setChecked}
      label={
        <Typography variant='body2'>
          <Trans i18nKey={i18nKey} components={{ Link: <Link to={privacyUrl} highlighted /> }} />
        </Typography>
      }
    />
  )
}

export default PrivacyCheckbox
