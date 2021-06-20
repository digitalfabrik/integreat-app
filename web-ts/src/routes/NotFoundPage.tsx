import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import Helmet from '../components/Helmet'

const NotFoundPage = (): ReactElement => {
  const { t } = useTranslation()
  const pageTitle = t('app:pageTitles.notFound')

  return (
    <div>
      <Helmet pageTitle={pageTitle} />
      not-found
    </div>
  )
}

export default NotFoundPage
