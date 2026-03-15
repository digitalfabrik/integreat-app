import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { NotFoundError } from 'shared/api'

import FailureSwitcher from './FailureSwitcher'
import Helmet from './Helmet'

type FailureSwitcherProps = {
  error: Error
}

const FailureSwitcherWithHelmet = ({ error }: FailureSwitcherProps): ReactElement => {
  const { t } = useTranslation('error')
  return (
    <>
      <Helmet pageTitle={error instanceof NotFoundError ? t('error:notFound.pageTitle') : t('error:pageTitle')} />
      <FailureSwitcher error={error} />
    </>
  )
}

export default FailureSwitcherWithHelmet
