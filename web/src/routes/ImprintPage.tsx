import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { IMPRINT_ROUTE, pathnameFromRouteInformation } from 'shared'
import { createImprintEndpoint, useLoadFromEndpoint } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import Page from '../components/Page'
import SkeletonPage from '../components/SkeletonPage'
import { cmsApiBaseUrl } from '../constants/urls'

const ImprintPage = ({ cityCode, languageCode, city }: CityRouteProps): ReactElement | null => {
  const { t } = useTranslation('imprint')

  const {
    data: imprint,
    loading,
    error: imprintError,
  } = useLoadFromEndpoint(createImprintEndpoint, cmsApiBaseUrl, {
    city: cityCode,
    language: languageCode,
  })

  if (!city) {
    return null
  }

  const pageTitle = `${t('pageTitle')} - ${city.name}`
  const languageChangePaths = city.languages.map(({ code, name }) => {
    const imprintPath = pathnameFromRouteInformation({ route: IMPRINT_ROUTE, cityCode, languageCode: code })
    return { path: imprintPath, name, code }
  })

  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    languageCode,
    pageTitle,
    Toolbar: <CityContentToolbar slug={imprint?.slug} />,
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <SkeletonPage />
      </CityContentLayout>
    )
  }

  if (!imprint) {
    const error = imprintError || new Error('Imprint should not be null!')
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <FailureSwitcherWithHelmet error={error} />
      </CityContentLayout>
    )
  }

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <Page lastUpdate={imprint.lastUpdate} title={imprint.title} content={imprint.content} />
    </CityContentLayout>
  )
}

export default ImprintPage
