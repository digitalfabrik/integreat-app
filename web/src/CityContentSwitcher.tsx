import React, { FunctionComponent, ReactElement, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'

import {
  CATEGORIES_ROUTE,
  cityContentPath,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  MALTE_HELP_FORM_OFFER_ROUTE,
  NEWS_ROUTE,
  normalizePath,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
} from 'shared'
import { CityModel, NotFoundError, useLoadFromEndpoint, createCityEndpoint } from 'shared/api'

import CityContentLayout from './components/CityContentLayout'
import FailureSwitcher from './components/FailureSwitcher'
import GeneralFooter from './components/GeneralFooter'
import GeneralHeader from './components/GeneralHeader'
import LanguageFailure from './components/LanguageFailure'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import buildConfig from './constants/buildConfig'
import { cmsApiBaseUrl } from './constants/urls'
import { LOCAL_NEWS_ROUTE, RoutePatterns, RouteType, TU_NEWS_DETAIL_ROUTE, TU_NEWS_ROUTE } from './routes'
import MalteHelpFormOfferPage from './routes/MalteHelpFormOfferPage'
import lazyWithRetry from './utils/retryImport'

const TuNewsDetailPage = lazyWithRetry(() => import('./routes/TuNewsDetailPage'))
const TuNewsPage = lazyWithRetry(() => import('./routes/TuNewsPage'))
const OffersPage = lazyWithRetry(() => import('./routes/OffersPage'))
const EventsPage = lazyWithRetry(() => import('./routes/EventsPage'))
const CategoriesPage = lazyWithRetry(() => import('./routes/CategoriesPage'))
const LocalNewsPage = lazyWithRetry(() => import('./routes/LocalNewsPage'))
const SprungbrettOfferPage = lazyWithRetry(() => import('./routes/SprungbrettOfferPage'))
const PoisPage = lazyWithRetry(() => import('./routes/PoisPage'))
const SearchPage = lazyWithRetry(() => import('./routes/SearchPage'))
const DisclaimerPage = lazyWithRetry(() => import('./routes/DisclaimerPage'))

type CityContentSwitcherProps = {
  languageCode: string
}

export type CityRouteProps = {
  city: CityModel | null
  pathname: string
  cityCode: string
  languageCode: string
}

const CityContentSwitcher = ({ languageCode }: CityContentSwitcherProps): ReactElement => {
  // This component is only opened when there is a cityCode in the route
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cityCode = useParams().cityCode!
  const { data: city, error, loading } = useLoadFromEndpoint(createCityEndpoint, cmsApiBaseUrl, { city: cityCode })
  const pathname = normalizePath(useLocation().pathname)

  if (!city && !loading) {
    const notFoundError = new NotFoundError({ type: 'city', id: cityCode, city: cityCode, language: languageCode })

    return (
      <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<GeneralFooter language={languageCode} />}>
        <FailureSwitcher error={error ?? notFoundError} />
      </Layout>
    )
  }

  const language = city?.languages.find(it => it.code === languageCode) ?? null
  if (city && !language) {
    return (
      <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<GeneralFooter language={languageCode} />}>
        <LanguageFailure
          cityModel={city}
          languageCode={languageCode}
          languageChangePaths={city.languages.map(({ code, name }) => ({
            code,
            name,
            path: cityContentPath({ cityCode, languageCode: code }),
          }))}
        />
      </Layout>
    )
  }

  const cityRouteProps: CityRouteProps = {
    city,
    pathname,
    cityCode,
    languageCode,
  }

  // If the city is not available yet, nothing is rendered in the routes. Therefore, we can render the route until we know whether the feature is enabled.
  const eventsEnabled = !city || city.eventsEnabled
  const offersEnabled = !city || city.offersEnabled
  const localNewsEnabled = buildConfig().featureFlags.newsStream && (!city || city.localNewsEnabled)
  const tuNewsEnabled = buildConfig().featureFlags.newsStream && (!city || city.tunewsEnabled)
  const poisEnabled = buildConfig().featureFlags.pois && (!city || city.poisEnabled)

  const render = <S extends RouteType>(
    route: S,
    Component: FunctionComponent<CityRouteProps>,
    childPattern?: string,
  ) => (
    <Route
      key={route}
      element={
        <Suspense
          fallback={
            city ? (
              <CityContentLayout
                languageChangePaths={null}
                languageCode={languageCode}
                isLoading
                route={route}
                city={city}>
                <LoadingSpinner />
              </CityContentLayout>
            ) : (
              <Layout />
            )
          }>
          <Component {...cityRouteProps} />
        </Suspense>
      }
      path={RoutePatterns[route]}>
      {!!childPattern && <Route element={null} path={childPattern} />}
    </Route>
  )

  return (
    <Routes>
      {render(SEARCH_ROUTE, SearchPage)}
      {render(DISCLAIMER_ROUTE, DisclaimerPage)}
      {render(CATEGORIES_ROUTE, CategoriesPage)}
      {eventsEnabled && render(EVENTS_ROUTE, EventsPage, ':eventId')}

      {offersEnabled && render(SPRUNGBRETT_OFFER_ROUTE, SprungbrettOfferPage)}
      {offersEnabled && render(MALTE_HELP_FORM_OFFER_ROUTE, MalteHelpFormOfferPage)}
      {offersEnabled && render(OFFERS_ROUTE, OffersPage)}
      {poisEnabled && render(POIS_ROUTE, PoisPage, ':slug')}
      {localNewsEnabled && render(LOCAL_NEWS_ROUTE, LocalNewsPage, ':newsId')}

      {tuNewsEnabled && render(TU_NEWS_ROUTE, TuNewsPage)}
      {tuNewsEnabled && render(TU_NEWS_DETAIL_ROUTE, TuNewsDetailPage)}

      {(localNewsEnabled || tuNewsEnabled) && (
        <Route
          path={NEWS_ROUTE}
          element={<Navigate to={localNewsEnabled ? LOCAL_NEWS_ROUTE : TU_NEWS_ROUTE} replace />}
        />
      )}
    </Routes>
  )
}

export default CityContentSwitcher
