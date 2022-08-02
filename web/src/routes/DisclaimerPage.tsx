import React, { ReactElement, useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  createDisclaimerEndpoint,
  DISCLAIMER_ROUTE,
  pathnameFromRouteInformation,
  useLoadFromEndpoint,
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import Page from '../components/Page'
import { cmsApiBaseUrl } from '../constants/urls'
import DateFormatterContext from '../contexts/DateFormatterContext'
import useWindowDimensions from '../hooks/useWindowDimensions'

const DisclaimerPage = ({ cityCode, languageCode, pathname, languages, cityModel }: CityRouteProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const dateFormatter = useContext(DateFormatterContext)
  const navigate = useNavigate()
  const { t } = useTranslation('disclaimer')

  const requestDisclaimer = useCallback(
    async () =>
      createDisclaimerEndpoint(cmsApiBaseUrl).request({
        city: cityCode,
        language: languageCode,
      }),
    [cityCode, languageCode]
  )

  const { data: disclaimer, loading, error: disclaimerError } = useLoadFromEndpoint(requestDisclaimer)

  const languageChangePaths = languages.map(({ code, name }) => {
    const disclaimerPath = pathnameFromRouteInformation({ route: DISCLAIMER_ROUTE, cityCode, languageCode: code })
    return { path: disclaimerPath, name, code }
  })

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: disclaimer ? { path: disclaimer.path } : null,
    languageChangePaths,
    route: DISCLAIMER_ROUTE,
    languageCode,
    pathname,
  }

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (!disclaimer) {
    const error = disclaimerError || new Error('Disclaimer should not be null!')
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  const pageTitle = `${t('pageTitle')} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <Page
        lastUpdate={disclaimer.lastUpdate}
        title={disclaimer.title}
        content={disclaimer.content}
        formatter={dateFormatter}
        onInternalLinkClick={navigate}
      />
    </LocationLayout>
  )
}

export default DisclaimerPage
