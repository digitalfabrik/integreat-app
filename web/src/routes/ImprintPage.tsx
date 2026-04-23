import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { IMPRINT_ROUTE, pathnameFromRouteInformation } from 'shared'
import { createImprintEndpoint, useLoadFromEndpoint } from 'shared/api'

import { CityRouteProps } from '../RegionContentNavigator'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import Page from '../components/Page'
import RegionContentLayout, { CityContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
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
    Toolbar: <RegionContentToolbar slug={imprint?.slug} />,
  }

  if (loading) {
    return (
      <RegionContentLayout isLoading {...locationLayoutParams}>
        <SkeletonPage />
      </RegionContentLayout>
    )
  }

  if (!imprint) {
    const error = imprintError || new Error('Imprint should not be null!')
    return (
      <RegionContentLayout isLoading {...locationLayoutParams}>
        <FailureSwitcherWithHelmet error={error} />
      </RegionContentLayout>
    )
  }

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <Page lastUpdate={imprint.lastUpdate} title={imprint.title} content={imprint.content} />
    </RegionContentLayout>
  )
}

export default ImprintPage
