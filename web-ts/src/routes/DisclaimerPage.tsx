import React, { useCallback, useContext, ReactElement } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import {
  normalizePath,
  CityModel,
  LanguageModel,
  DISCLAIMER_ROUTE,
  createDisclaimerEndpoint,
  NotFoundError,
  useLoadFromEndpoint
} from 'api-client'
import LocationLayout from '../components/LocationLayout'
import DateFormatterContext from '../context/DateFormatterContext'
import Page from '../components/Page'
import { cmsApiBaseUrl } from '../constants/urls'
import { createPath } from './index'
import LoadingSpinner from '../components/LoadingSpinner'
import FailureSwitcher from '../components/FailureSwitcher'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

const DisclaimerPage = (props: PropsType): ReactElement => {
  const { match, cityModel, languages, location } = props
  const { languageCode, cityCode } = match.params
  const viewportSmall = false
  const pathname = normalizePath(location.pathname)
  const dateFormatter = useContext(DateFormatterContext)
  const history = useHistory()

  const requestDisclaimer = useCallback(async () => {
    return createDisclaimerEndpoint(cmsApiBaseUrl).request({
      city: cityCode,
      language: languageCode
    })
  }, [cityCode, languageCode])

  const { data: disclaimer, loading, error: disclaimerError } = useLoadFromEndpoint(requestDisclaimer)

  const languageChangePaths = languages.map(({ code, name }) => {
    const rootPath = createPath(DISCLAIMER_ROUTE, { cityCode, languageCode: code })
    return { path: rootPath, name, code }
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
    const error =
      disclaimerError ||
      new NotFoundError({
        type: 'disclaimer',
        id: pathname,
        city: cityCode,
        language: languageCode
      })
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }
  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
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
