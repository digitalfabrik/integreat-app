import React, { ReactElement, Suspense, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'

import {
  CATEGORIES_ROUTE,
  createCitiesEndpoint,
  LANDING_ROUTE,
  MAIN_DISCLAIMER_ROUTE,
  NOT_FOUND_ROUTE,
  useLoadFromEndpoint
} from 'api-client'

import CityContentSwitcher from './CityContentSwitcher'
import FailureSwitcher from './components/FailureSwitcher'
import GeneralFooter from './components/GeneralFooter'
import GeneralHeader from './components/GeneralHeader'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import buildConfig from './constants/buildConfig'
import { cmsApiBaseUrl } from './constants/urls'
import useWindowDimensions from './hooks/useWindowDimensions'
import { cityContentPattern, createPath, RoutePatterns } from './routes'
import retryImport from './utils/retryImport'

type PropsType = {
  setContentLanguage: (languageCode: string) => void
}

const MainDisclaimerPage = React.lazy(() => retryImport(() => import('./routes/MainDisclaimerPage')))
const LandingPage = React.lazy(() => retryImport(() => import('./routes/LandingPage')))
const NotFoundPage = React.lazy(() => retryImport(() => import('./routes/NotFoundPage')))

const RootSwitcher = ({ setContentLanguage }: PropsType): ReactElement => {
  const requestCities = useCallback(async () => createCitiesEndpoint(cmsApiBaseUrl).request(), [])
  const { data: cities, loading, error } = useLoadFromEndpoint(requestCities)
  const { i18n } = useTranslation()
  const fixedCity = buildConfig().featureFlags.fixedCity
  // LanguageCode is always the second param (if there is one)
  const languageCode = useRouteMatch<{ languageCode?: string }>('/:slug/:languageCode')?.params.languageCode
  const { viewportSmall } = useWindowDimensions()

  const detectedLanguageCode = i18n.language
  const language = languageCode ?? detectedLanguageCode

  if (language !== detectedLanguageCode) {
    setContentLanguage(language)
  }

  const landingPath = createPath(LANDING_ROUTE, { languageCode: language })
  const cityContentPath = createPath(CATEGORIES_ROUTE, { cityCode: fixedCity ?? ':cityCode', languageCode: language })

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    )
  }

  if (!cities || error) {
    return (
      <Layout
        header={<GeneralHeader languageCode={language} viewportSmall={viewportSmall} />}
        footer={<GeneralFooter language={language} />}>
        <FailureSwitcher error={error ?? new Error('Cities not available')} />
      </Layout>
    )
  }
  const relevantCities = fixedCity ? cities.filter(city => city.code === fixedCity) : cities

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        {fixedCity && <Redirect exact from={RoutePatterns[LANDING_ROUTE]} to={cityContentPath} />}

        <Route
          exact
          path={RoutePatterns[LANDING_ROUTE]}
          render={props => <LandingPage cities={relevantCities} {...props} />}
        />
        <Route
          exact
          path={RoutePatterns[MAIN_DISCLAIMER_ROUTE]}
          render={() => <MainDisclaimerPage languageCode={language} />}
        />
        <Route exact path={RoutePatterns[NOT_FOUND_ROUTE]} component={NotFoundPage} />
        <Route path={cityContentPattern} render={props => <CityContentSwitcher cities={relevantCities} {...props} />} />
        <Redirect exact from='/' to={landingPath} />
        <Redirect exact from={`/${LANDING_ROUTE}`} to={landingPath} />
        <Redirect exact from='/:cityCode' to={cityContentPath} />
      </Switch>
    </Suspense>
  )
}

export default RootSwitcher
