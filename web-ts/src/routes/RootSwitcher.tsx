import React, { ReactElement, useCallback } from 'react'
import { Redirect, Route, Switch, useRouteMatch, generatePath } from 'react-router-dom'
import LandingPage from './landing/LandingPage'
import NotFoundPage from './not-found/NotFoundPage'
import {
  useLoadFromEndpoint,
  LANDING_ROUTE,
  CityModel,
  createCitiesEndpoint,
  NOT_FOUND_ROUTE,
  MAIN_DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  NEWS_ROUTE,
  LOCAL_NEWS_TYPE,
  TU_NEWS_TYPE,
  SEARCH_ROUTE,
  DISCLAIMER_ROUTE, CATEGORIES_ROUTE
} from 'api-client'
import CityContentSwitcher from './CityContentSwitcher'
import { cmsApiBaseUrl } from '../constants/urls'
import Layout from '../components/Layout'
import GeneralHeader from '../components/GeneralHeader'
import GeneralFooter from '../components/GeneralFooter'
import FailureSwitcher from '../components/FailureSwitcher'
import MainDisclaimerPage from './main-disclaimer/MainDisclaimerPage'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTranslation } from 'react-i18next'

export const cityContentPattern = `/:cityCode/:languageCode`

export const RoutePatterns = {
  [LANDING_ROUTE]: `/${LANDING_ROUTE}/:languageCode`,
  [MAIN_DISCLAIMER_ROUTE]: `/${MAIN_DISCLAIMER_ROUTE}`,
  [NOT_FOUND_ROUTE]: `/${NOT_FOUND_ROUTE}`,

  [EVENTS_ROUTE]: `${cityContentPattern}/${EVENTS_ROUTE}/:eventId?`,
  [OFFERS_ROUTE]: `${cityContentPattern}/${OFFERS_ROUTE}/:offerId?`,
  [POIS_ROUTE]: `${cityContentPattern}/${POIS_ROUTE}/:locationId?`,
  [LOCAL_NEWS_TYPE]: `${cityContentPattern}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/:newsId?`,
  [TU_NEWS_TYPE]: `${cityContentPattern}/${NEWS_ROUTE}/${TU_NEWS_TYPE}/:newsId?`,
  [SEARCH_ROUTE]: `${cityContentPattern}/${SEARCH_ROUTE}`,
  [DISCLAIMER_ROUTE]: `${cityContentPattern}/${DISCLAIMER_ROUTE}`,
  [CATEGORIES_ROUTE]: `${cityContentPattern}/:categoriesId*`,
}

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

  const landingPath = generatePath(RoutePatterns[LANDING_ROUTE], { languageCode: language })
  const cityContentPath = generatePath(cityContentPattern, { cityCode: ':cityCode', languageCode: language })

  if (loading) {
    return <Layout><LoadingSpinner /></Layout>
  }

  if (!cities || error) {
    return (
      <Layout header={<GeneralHeader landingPath={landingPath} viewportSmall={false} />} footer={<GeneralFooter language={language} />}>
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
      {/* TODO redirects for aschaffenburg */}
    </Switch>
  )
}

export default RootSwitcher
