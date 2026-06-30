import React, { FunctionComponent, ReactElement, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router'

import {
  CATEGORIES_ROUTE,
  regionContentPath,
  IMPRINT_ROUTE,
  EVENTS_ROUTE,
  NEWS_ROUTE,
  normalizePath,
  PLACES_ROUTE,
  SEARCH_ROUTE,
  parseQueryParams,
} from 'shared'
import { NotFoundError, createRegionEndpoint } from 'shared/api'

import ChatContainer from './components/ChatContainer'
import FailureSwitcherWithHelmet from './components/FailureSwitcherWithHelmet'
import Footer from './components/Footer'
import GeneralHeader from './components/GeneralHeader'
import LanguageFailure from './components/LanguageFailure'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import RegionContentLayout from './components/RegionContentLayout'
import { cmsApiBaseUrl } from './constants/urls'
import useQueryFromEndpoint from './hooks/useQueryFromEndpoint'
import {
  LOCAL_NEWS_ROUTE,
  RoutePatterns,
  RouteType,
  TU_NEWS_DETAIL_ROUTE,
  TU_NEWS_ROUTE,
  RegionRouteProps,
} from './routes'
import lazyWithRetry from './utils/retryImport'

const TuNewsDetailPage = lazyWithRetry(() => import('./routes/TuNewsDetailPage'))
const TuNewsPage = lazyWithRetry(() => import('./routes/TuNewsPage'))
const EventsPage = lazyWithRetry(() => import('./routes/EventsPage'))
const CategoriesPage = lazyWithRetry(() => import('./routes/CategoriesPage'))
const LocalNewsPage = lazyWithRetry(() => import('./routes/LocalNewsPage'))
const PlacesPage = lazyWithRetry(() => import('./routes/PlacesPage'))
const SearchPage = lazyWithRetry(() => import('./routes/SearchPage'))
const ImprintPage = lazyWithRetry(() => import('./routes/ImprintPage'))

type RegionContentNavigatorProps = {
  languageCode: string
}

const RegionContentNavigator = ({ languageCode }: RegionContentNavigatorProps): ReactElement => {
  const externalChatId = parseQueryParams(useSearchParams()[0]).chatId
  // This component is only opened when there is a regionCode in the route
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const regionCode = useParams().regionCode!
  const { data: region, error: regionError } = useQueryFromEndpoint(createRegionEndpoint, cmsApiBaseUrl, {
    region: regionCode,
  })
  const pathname = normalizePath(useLocation().pathname)

  if (regionError) {
    const error =
      regionError instanceof NotFoundError
        ? new NotFoundError({
            type: 'region',
            id: regionCode,
            region: regionCode,
            language: languageCode,
          })
        : regionError

    return (
      <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
        <FailureSwitcherWithHelmet error={error} />
      </Layout>
    )
  }

  const language = region?.languages.find(it => it.code === languageCode) ?? null
  if (region && !language) {
    return (
      <Layout
        header={<GeneralHeader languageCode={languageCode} regionLanguages={region.languages} />}
        footer={<Footer />}>
        <LanguageFailure
          regionModel={region}
          languageCode={languageCode}
          languageChangePaths={region.languages.map(({ code, name }) => ({
            code,
            name,
            path: regionContentPath({ regionCode, languageCode: code }),
          }))}
        />
      </Layout>
    )
  }

  if (externalChatId) {
    if (!region) {
      return <LoadingSpinner />
    }
    return (
      <Layout fitScreen>
        <ChatContainer region={region} languageCode={languageCode} languageChangePaths={[]} />
      </Layout>
    )
  }

  const regionRouteProps: RegionRouteProps = {
    region: region ?? null,
    pathname,
    regionCode,
    languageCode,
  }

  // If the region is not available yet, nothing is rendered in the routes. Therefore, we can render the route until we know whether the feature is enabled.
  const eventsEnabled = !region || region.eventsEnabled
  const localNewsEnabled = !region || region.localNewsEnabled
  const tuNewsEnabled = !region || region.tuNewsEnabled
  const placesEnabled = !region || region.placesEnabled

  const render = <S extends RouteType>(
    route: S,
    Component: FunctionComponent<RegionRouteProps>,
    childPattern?: string,
  ) => (
    <Route
      key={route}
      element={
        <Suspense
          fallback={
            region ? (
              <RegionContentLayout
                languageChangePaths={null}
                languageCode={languageCode}
                isLoading
                region={region}
                pageTitle={null}
                slug={null}
              />
            ) : (
              <Layout />
            )
          }>
          <Component {...regionRouteProps} />
        </Suspense>
      }
      path={RoutePatterns[route]}>
      {!!childPattern && <Route element={null} path={childPattern} />}
    </Route>
  )

  return (
    <Routes>
      {render(SEARCH_ROUTE, SearchPage)}
      {render(IMPRINT_ROUTE, ImprintPage)}
      {render(CATEGORIES_ROUTE, CategoriesPage)}
      {eventsEnabled && render(EVENTS_ROUTE, EventsPage, ':eventId')}

      {placesEnabled && render(PLACES_ROUTE, PlacesPage, ':slug')}
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

export default RegionContentNavigator
