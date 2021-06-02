import React, { ReactElement, useCallback } from 'react'
import { generatePath, Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import LandingPage from './landing/LandingPage'
import NotFoundPage from './not-found/NotFoundPage'
import {
  CATEGORIES_ROUTE,
  CityModel,
  createCitiesEndpoint,
  DISCLAIMER_ROUTE,
  DisclaimerRouteType,
  EVENTS_ROUTE,
  EventsRouteType,
  LANDING_ROUTE,
  LandingRouteType,
  LOCAL_NEWS_TYPE,
  LocalNewsType,
  MAIN_DISCLAIMER_ROUTE,
  MainDisclaimerRouteType,
  NEWS_ROUTE,
  NewsRouteType,
  NOT_FOUND_ROUTE,
  NotFoundRouteType,
  OFFERS_ROUTE,
  OffersRouteType,
  POIS_ROUTE,
  PoisRouteType,
  SEARCH_ROUTE,
  SearchRouteType, SPRUNGBRETT_OFFER_ROUTE, SprungbrettOfferRouteType,
  TU_NEWS_TYPE,
  TuNewsType,
  useLoadFromEndpoint
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
type cityContentPatternType = typeof cityContentPattern

export const RoutePatterns = {
  [LANDING_ROUTE]: `/${LANDING_ROUTE}/:languageCode` as `/${LandingRouteType}/:languageCode`,
  [MAIN_DISCLAIMER_ROUTE]: `/${MAIN_DISCLAIMER_ROUTE}` as `/${MainDisclaimerRouteType}`,
  [NOT_FOUND_ROUTE]: `/${NOT_FOUND_ROUTE}` as `/${NotFoundRouteType}`,

  [EVENTS_ROUTE]: `${cityContentPattern}/${EVENTS_ROUTE}/:eventId?` as `${cityContentPatternType}/${EventsRouteType}:eventId?`,
  [SPRUNGBRETT_OFFER_ROUTE]: `${cityContentPattern}/${OFFERS_ROUTE}/${SPRUNGBRETT_OFFER_ROUTE}` as `${cityContentPatternType}/${OffersRouteType}/${SprungbrettOfferRouteType}`,
  [OFFERS_ROUTE]: `${cityContentPattern}/${OFFERS_ROUTE}` as `${cityContentPatternType}/${OffersRouteType}`,
  [POIS_ROUTE]: `${cityContentPattern}/${POIS_ROUTE}/:poiId?` as `${cityContentPatternType}/${PoisRouteType}:poiId?`,
  [LOCAL_NEWS_TYPE]: `${cityContentPattern}/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/:newsId?` as `${cityContentPatternType}/${NewsRouteType}/${LocalNewsType}/:newsId?`,
  [TU_NEWS_TYPE]: `${cityContentPattern}/${NEWS_ROUTE}/${TU_NEWS_TYPE}/:newsId?` as `${cityContentPatternType}/${NewsRouteType}/${TuNewsType}/:newsId?`,
  [SEARCH_ROUTE]: `${cityContentPattern}/${SEARCH_ROUTE}` as `${cityContentPatternType}/${SearchRouteType}`,
  [DISCLAIMER_ROUTE]: `${cityContentPattern}/${DISCLAIMER_ROUTE}` as `${cityContentPatternType}/${DisclaimerRouteType}`,
  [CATEGORIES_ROUTE]: `${cityContentPattern}/:categoryId*` as `${cityContentPatternType}/:categoryId*`
}

export type RouteType = keyof typeof RoutePatterns
export type RoutePatternType = typeof RoutePatterns[keyof typeof RoutePatterns]

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
