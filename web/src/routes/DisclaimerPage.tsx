import React, { ReactElement, useCallback, useContext } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import {
  CityModel,
  createDisclaimerEndpoint,
  DISCLAIMER_ROUTE,
  LanguageModel,
  normalizePath,
  useLoadFromEndpoint
} from 'api-client'
import LocationLayout from '../components/LocationLayout'
import DateFormatterContext from '../contexts/DateFormatterContext'
import Page from '../components/Page'
import { cmsApiBaseUrl } from '../constants/urls'
import { createPath } from './index'
import LoadingSpinner from '../components/LoadingSpinner'
import FailureSwitcher from '../components/FailureSwitcher'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Helmet from '../components/Helmet'
import { useTranslation } from 'react-i18next'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

const DisclaimerPage = (props: PropsType): ReactElement => {
  const { match, cityModel, languages, location } = props
  const { languageCode, cityCode } = match.params
  const { viewportSmall } = useWindowDimensions()
  const pathname = normalizePath(location.pathname)
  const dateFormatter = useContext(DateFormatterContext)
  const history = useHistory()
  const { t } = useTranslation('disclaimer')

  const requestDisclaimer = useCallback(async () => {
    return createDisclaimerEndpoint(cmsApiBaseUrl).request({
      city: cityCode,
      language: languageCode
    })
  }, [cityCode, languageCode])

  const { data: disclaimer, loading, error: disclaimerError } = useLoadFromEndpoint(requestDisclaimer)

  const languageChangePaths = languages.map(({ code, name }) => {
    const disclaimerPath = createPath(DISCLAIMER_ROUTE, { cityCode, languageCode: code })
    return { path: disclaimerPath, name, code }
  })

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: disclaimer ? { path: disclaimer.path } : null,
    languageChangePaths,
    route: DISCLAIMER_ROUTE,
    languageCode,
    pathname
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
        onInternalLinkClick={history.push}
      />
    </LocationLayout>
  )
}

export default DisclaimerPage
