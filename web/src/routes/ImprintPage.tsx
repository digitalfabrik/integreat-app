import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { IMPRINT_ROUTE, pathnameFromRouteInformation } from 'shared'
import { createImprintEndpoint } from 'shared/api'

import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import Page from '../components/Page'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import SkeletonPage from '../components/SkeletonPage'
import { cmsApiBaseUrl } from '../constants/urls'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import { RegionRouteProps } from './index'

const ImprintPage = ({ regionCode, languageCode, region }: RegionRouteProps): ReactElement | null => {
  const { t } = useTranslation('imprint')

  const {
    data: imprint,
    isPending,
    error,
  } = useQueryFromEndpoint(createImprintEndpoint, cmsApiBaseUrl, {
    region: regionCode,
    language: languageCode,
  })

  if (!region) {
    return null
  }

  const pageTitle = `${t('pageTitle')} - ${region.name}`
  const languageChangePaths = region.languages.map(({ code, name }) => {
    const imprintPath = pathnameFromRouteInformation({ route: IMPRINT_ROUTE, regionCode, languageCode: code })
    return { path: imprintPath, name, code }
  })

  const locationLayoutParams: Omit<RegionContentLayoutProps, 'isLoading'> = {
    region,
    languageChangePaths,
    languageCode,
    pageTitle,
    toolbar: <RegionContentToolbar />,
  }

  if (error) {
    return (
      <RegionContentLayout isLoading {...locationLayoutParams}>
        <FailureSwitcherWithHelmet error={error} />
      </RegionContentLayout>
    )
  }

  return (
    <RegionContentLayout isLoading={isPending} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
      {imprint ? (
        <Page lastUpdate={imprint.lastUpdate} title={imprint.title} content={imprint.content} />
      ) : (
        <SkeletonPage />
      )}
    </RegionContentLayout>
  )
}

export default ImprintPage
