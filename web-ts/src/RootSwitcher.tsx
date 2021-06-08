import React, { ReactElement, useCallback } from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import LandingPage from './routes/LandingPage'
import NotFoundPage from './routes/NotFoundPage'
import {
  CATEGORIES_ROUTE,
  CityModel,
  createCitiesEndpoint,
  LANDING_ROUTE,
  MAIN_DISCLAIMER_ROUTE,
  NOT_FOUND_ROUTE,
  useLoadFromEndpoint
} from 'api-client'
import CityContentSwitcher from './CityContentSwitcher'
import { cmsApiBaseUrl } from './constants/urls'
import Layout from './components/Layout'
import GeneralHeader from './components/GeneralHeader'
import GeneralFooter from './components/GeneralFooter'
import FailureSwitcher from './components/FailureSwitcher'
import MainDisclaimerPage from './routes/MainDisclaimerPage'
import LoadingSpinner from './components/LoadingSpinner'
import { useTranslation } from 'react-i18next'
import { cityContentPattern, createPath, RoutePatterns } from './routes'

type PropsType = {
  setContentLanguage: (languageCode: string) => void
}

const RootSwitcher = ({ setContentLanguage }: PropsType): ReactElement => {
  const requestCities = useCallback(async () => createCitiesEndpoint(cmsApiBaseUrl).request(undefined), [])
  const { data: cities, loading, error } = useLoadFromEndpoint<CityModel[]>(requestCities)
  const { i18n } = useTranslation()
  // LanguageCode is always the second param (if there is one)
  const languageCode = useRouteMatch<{ languageCode?: string }>('/:slug/:languageCode')?.params.languageCode

  const detectedLanguageCode = i18n.language
  const language = languageCode ?? detectedLanguageCode

  if (language !== detectedLanguageCode) {
    setContentLanguage(language)
  }

  const landingPath = createPath(LANDING_ROUTE, { languageCode: language })
  const cityContentPath = createPath(CATEGORIES_ROUTE, { cityCode: ':cityCode', languageCode: language })

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
        header={<GeneralHeader languageCode={language} viewportSmall={false} />}
        footer={<GeneralFooter language={language} />}>
        <FailureSwitcher error={error ?? new Error('Cities not available')} />
      </Layout>
    )
  }

  return (
    <Switch>
      <Route exact path={RoutePatterns[LANDING_ROUTE]} component={LandingPage} />
      <Route exact path={RoutePatterns[MAIN_DISCLAIMER_ROUTE]} component={MainDisclaimerPage} />
      <Route exact path={RoutePatterns[NOT_FOUND_ROUTE]} component={NotFoundPage} />
      <Route path={cityContentPattern} render={props => <CityContentSwitcher cities={cities} {...props} />} />

      <Redirect exact from='/' to={landingPath} />
      <Redirect exact from={`/${LANDING_ROUTE}`} to={landingPath} />
      <Redirect exact from={`/:cityCode`} to={cityContentPath} />
      {/* TODO IGAPP-672: Add redirects for aschaffenburg */}
    </Switch>
  )
}

export default RootSwitcher
