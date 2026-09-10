import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { NotFoundError } from 'shared/api'

import FailureSwitcher from './FailureSwitcher'
import Helmet from './Helmet'

type FailureSwitcherProps = {
  error: Error
}

const FailureSwitcherWithHelmet = ({ error }: FailureSwitcherProps): ReactElement => {
  const { t } = useTranslation()
  return (
    <>
      <Helmet pageTitle={error instanceof NotFoundError ? t($ => $.error.pageNotFound) : t($ => $.error.title)} />
      <FailureSwitcher error={error} />
    </>
  )
}

export default FailureSwitcherWithHelmet
