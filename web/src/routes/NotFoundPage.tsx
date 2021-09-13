import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Helmet from '../components/Helmet'

const NotFoundPage = (): ReactElement => {
  const { t } = useTranslation('error')
  const pageTitle = t('notFound.pageTitle')

  return (
    <div>
      <Helmet pageTitle={pageTitle} />
      not-found
    </div>
  )
}

export default NotFoundPage
