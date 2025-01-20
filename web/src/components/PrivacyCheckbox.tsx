import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

import Checkbox from './base/Checkbox'

type PrivacyCheckboxProps = {
  checked: boolean
  setChecked: (checked: boolean) => void
  id: string
}

const PrivacyCheckbox = ({ checked, setChecked, id }: PrivacyCheckboxProps): ReactElement => {
  const link = 'https://integreat-app.de/datenschutz/'
  return (
    <Checkbox
      checked={checked}
      setChecked={setChecked}
      label={
        <Trans i18nKey='common:privacyAgreement'>
          This gets replaced
          <Link to={link}>by react-i18next</Link>
        </Trans>
      }
      id={id}
    />
  )
}

export default PrivacyCheckbox
