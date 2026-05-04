import React, { FunctionComponent, ReactElement, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router'

import {
  CATEGORIES_ROUTE,
  regionContentPath,
  IMPRINT_ROUTE,
  EVENTS_ROUTE,
  NEWS_ROUTE,
  normalizePath,
  POIS_ROUTE,
  SEARCH_ROUTE,
} from 'shared'
import { RegionModel, NotFoundError, useLoadFromEndpoint, createRegionEndpoint } from 'shared/api'

import FailureSwitcherWithHelmet from './components/FailureSwitcherWithHelmet'
import Footer from './components/Footer'
import GeneralHeader from './components/GeneralHeader'
import LanguageFailure from './components/LanguageFailure'
import Layout from './components/Layout'
import RegionContentLayout from './components/RegionContentLayout'
import { cmsApiBaseUrl } from './constants/urls'
import { LOCAL_NEWS_ROUTE, RoutePatterns, RouteType, TU_NEWS_DETAIL_ROUTE, TU_NEWS_ROUTE } from './routes'
import lazyWithRetry from './utils/retryImport'

const TuNewsDetailPage = lazyWithRetry(() => import('./routes/TuNewsDetailPage'))
const TuNewsPage = lazyWithRetry(() => import('./routes/TuNewsPage'))
const EventsPage = lazyWithRetry(() => import('./routes/EventsPage'))
const CategoriesPage = lazyWithRetry(() => import('./routes/CategoriesPage'))
const LocalNewsPage = lazyWithRetry(() => import('./routes/LocalNewsPage'))
const PoisPage = lazyWithRetry(() => import('./routes/PoisPage'))
const SearchPage = lazyWithRetry(() => import('./routes/SearchPage'))
const ImprintPage = lazyWithRetry(() => import('./routes/ImprintPage'))

type RegionContentNavigatorProps = {
  languageCode: string
}

export type RegionRouteProps = {
  region: RegionModel | null
  pathname: string
  regionCode: string
  languageCode: string
}

const RegionContentNavigator = ({ languageCode }: RegionContentNavigatorProps): ReactElement => {
  // This component is only opened when there is a regionCode in the route
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const regionCode = useParams().regionCode!
  const {
    data: region,
    error,
    loading,
  } = useLoadFromEndpoint(createRegionEndpoint, cmsApiBaseUrl, { region: regionCode })
  const pathname = normalizePath(useLocation().pathname)

  if (!region && !loading) {
    const notFoundError = new NotFoundError({
      type: 'region',
      id: regionCode,
      region: regionCode,
      language: languageCode,
    })

    return (
      <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
        <FailureSwitcherWithHelmet error={error ?? notFoundError} />
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

  const regionRouteProps: RegionRouteProps = {
    region,
    pathname,
    regionCode,
    languageCode,
  }

  // If the region is not available yet, nothing is rendered in the routes. Therefore, we can render the route until we know whether the feature is enabled.
  const eventsEnabled = !region || region.eventsEnabled
  const localNewsEnabled = !region || region.localNewsEnabled
  const tuNewsEnabled = !region || region.tunewsEnabled
  const poisEnabled = !region || region.poisEnabled

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

export default RegionContentNavigator
