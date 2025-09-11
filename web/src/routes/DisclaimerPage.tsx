import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { DISCLAIMER_ROUTE, pathnameFromRouteInformation } from 'shared'
import { createDisclaimerEndpoint, useLoadFromEndpoint } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import Page from '../components/Page'
import { cmsApiBaseUrl } from '../constants/urls'

const DisclaimerPage = ({ cityCode, languageCode, city }: CityRouteProps): ReactElement | null => {
  const { t } = useTranslation('disclaimer')

  const {
    data: disclaimer,
    loading,
    error: disclaimerError,
  } = useLoadFromEndpoint(createDisclaimerEndpoint, cmsApiBaseUrl, {
    city: cityCode,
    language: languageCode,
  })

  if (!city) {
    return null
  }

  const pageTitle = `${t('pageTitle')} - ${city.name}`
  const Toolbar = (
    <CityContentToolbar feedbackTarget={disclaimer?.slug} route={DISCLAIMER_ROUTE} pageTitle={pageTitle} />
  )

  const languageChangePaths = city.languages.map(({ code, name }) => {
    const disclaimerPath = pathnameFromRouteInformation({ route: DISCLAIMER_ROUTE, cityCode, languageCode: code })
    return { path: disclaimerPath, name, code }
  })

  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    languageCode,
    Toolbar,
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (!disclaimer) {
    const error = disclaimerError || new Error('Disclaimer should not be null!')
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <Page lastUpdate={disclaimer.lastUpdate} title={disclaimer.title} content={disclaimer.content} />
    </CityContentLayout>
  )
}

export default DisclaimerPage
