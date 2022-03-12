import React, { FunctionComponent, ReactElement, Suspense, useCallback } from 'react'
import { Route, Routes, useLocation, useParams } from 'react-router-dom'

import {
  CATEGORIES_ROUTE,
  cityContentPath,
  CityModel,
  createLanguagesEndpoint,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  LanguageModel,
  normalizePath,
  NotFoundError,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  SHELTER_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  useLoadFromEndpoint
} from 'api-client'

import FailureSwitcher from './components/FailureSwitcher'
import GeneralFooter from './components/GeneralFooter'
import GeneralHeader from './components/GeneralHeader'
import LanguageFailure from './components/LanguageFailure'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import LocationLayout from './components/LocationLayout'
import buildConfig from './constants/buildConfig'
import { cmsApiBaseUrl } from './constants/urls'
import useWindowDimensions from './hooks/useWindowDimensions'
import { LOCAL_NEWS_ROUTE, RoutePatterns, RouteType, TU_NEWS_DETAIL_ROUTE, TU_NEWS_ROUTE } from './routes'
import ShelterPage from './routes/ShelterPage'
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

type PropsType = {
  cities: CityModel[]
  languageCode: string
}

export type CityRouteProps = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
  pathname: string
  cityCode: string
  languageCode: string
}

const CityContentSwitcher = ({ cities, languageCode }: PropsType): ReactElement => {
  const cityCode = useParams().cityCode!
  const pathname = normalizePath(useLocation().pathname)
  const { viewportSmall } = useWindowDimensions()
  const cityModel = cities.find(it => it.code === cityCode)

  const requestLanguages = useCallback(
    async () => createLanguagesEndpoint(cmsApiBaseUrl).request({ city: cityCode }),
    [cityCode]
  )
  const { data: languages, loading, error: loadingError } = useLoadFromEndpoint<LanguageModel[]>(requestLanguages)
  const languageModel = languages?.find(it => it.code === languageCode)

  if (!cityModel || !languageModel || !languages) {
    if (loading) {
      return (
        <Layout>
          <LoadingSpinner />
        </Layout>
      )
    }

    if (loadingError || !cityModel || !languages) {
      const cityError = !cityModel
        ? new NotFoundError({ type: 'city', id: cityCode, city: cityCode, language: languageCode })
        : null
      const error = cityError || loadingError || new Error('Languages should not be null!')

      return (
        <Layout
          header={<GeneralHeader languageCode={languageCode} viewportSmall={viewportSmall} />}
          footer={<GeneralFooter language={languageCode} />}>
          <FailureSwitcher error={error} />
        </Layout>
      )
    }

    return (
      <Layout
        header={<GeneralHeader languageCode={languageCode} viewportSmall={viewportSmall} />}
        footer={<GeneralFooter language={languageCode} />}>
        <LanguageFailure
          cityModel={cityModel}
          languageCode={languageCode}
          languageChangePaths={languages.map(({ code, name }) => ({
            code,
            name,
            path: cityContentPath({ cityCode, languageCode: code })
          }))}
        />
      </Layout>
    )
  }

  const cityRouteProps: CityRouteProps = {
    cities,
    languages,
    cityModel,
    languageModel,
    pathname,
    cityCode,
    languageCode
  }
  const { eventsEnabled, offersEnabled } = cityModel
  const localNewsEnabled = buildConfig().featureFlags.newsStream && cityModel.localNewsEnabled
  const tuNewsEnabled = buildConfig().featureFlags.newsStream && cityModel.tunewsEnabled
  const poisEnabled = buildConfig().featureFlags.pois && cityModel.poisEnabled

  const suspenseLayoutProps = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths: null,
    languageCode,
    pathname,
    isLoading: true
  }

  const render = <S extends RouteType>(
    route: S,
    Component: FunctionComponent<CityRouteProps>,
    childPattern?: string
  ) => (
    <Route
      key={route}
      element={
        <Suspense
          fallback={
            <LocationLayout {...suspenseLayoutProps} route={route}>
              <LoadingSpinner />
            </LocationLayout>
          }>
          <Component {...cityRouteProps} />
        </Suspense>
      }
      path={RoutePatterns[route]}>
      {childPattern && <Route element={null} path={childPattern} />}
    </Route>
  )

  return (
    <Routes>
      {render(SEARCH_ROUTE, SearchPage)}
      {render(DISCLAIMER_ROUTE, DisclaimerPage)}
      {render(CATEGORIES_ROUTE, CategoriesPage)}
      {eventsEnabled && render(EVENTS_ROUTE, EventsPage, ':eventId')}

      {offersEnabled && render(SHELTER_ROUTE, ShelterPage, ':shelterId')}
      {offersEnabled && render(SPRUNGBRETT_OFFER_ROUTE, SprungbrettOfferPage)}
      {offersEnabled && render(OFFERS_ROUTE, OffersPage)}
      {poisEnabled && render(POIS_ROUTE, PoisPage, ':poiId')}
      {localNewsEnabled && render(LOCAL_NEWS_ROUTE, LocalNewsPage, ':newsId')}

      {tuNewsEnabled && render(TU_NEWS_ROUTE, TuNewsPage)}
      {tuNewsEnabled && render(TU_NEWS_DETAIL_ROUTE, TuNewsDetailPage)}
    </Routes>
  )
}

export default CityContentSwitcher
