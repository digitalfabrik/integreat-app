import React, { FunctionComponent, ReactElement, ReactNode, Suspense, useCallback } from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import {
  CATEGORIES_ROUTE,
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
  SPRUNGBRETT_OFFER_ROUTE,
  useLoadFromEndpoint
} from 'api-client'
import { cmsApiBaseUrl } from './constants/urls'
import Layout from './components/Layout'
import FailureSwitcher from './components/FailureSwitcher'
import LanguageFailure from './components/LanguageFailure'
import useWindowDimensions from './hooks/useWindowDimensions'
import GeneralHeader from './components/GeneralHeader'
import GeneralFooter from './components/GeneralFooter'
import LoadingSpinner from './components/LoadingSpinner'
import {
  createPath,
  LOCAL_NEWS_ROUTE,
  RoutePatterns,
  RouteProps,
  RouteType,
  TU_NEWS_DETAIL_ROUTE,
  TU_NEWS_ROUTE
} from './routes'
import buildConfig from './constants/buildConfig'
import LocationLayout from './components/LocationLayout'

const TuNewsDetailPage = React.lazy(() => import('./routes/TuNewsDetailPage'))
const TuNewsPage = React.lazy(() => import('./routes/TuNewsPage'))
const OffersPage = React.lazy(() => import('./routes/OffersPage'))
const EventsPage = React.lazy(() => import('./routes/EventsPage'))
const CategoriesPage = React.lazy(() => import('./routes/CategoriesPage'))
const LocalNewsPage = React.lazy(() => import('./routes/LocalNewsPage'))
const SprungbrettOfferPage = React.lazy(() => import('./routes/SprungbrettOfferPage'))
const PoisPage = React.lazy(() => import('./routes/PoisPage'))
const SearchPage = React.lazy(() => import('./routes/SearchPage'))
const DisclaimerPage = React.lazy(() => import('./routes/DisclaimerPage'))

type PropsType = {
  cities: CityModel[]
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

export type CityRouteProps = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
}

const CityContentSwitcher = ({ cities, match, location }: PropsType): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { cityCode, languageCode } = match.params
  const cityModel = cities.find(it => it.code === cityCode)

  const requestLanguages = useCallback(async () => {
    return createLanguagesEndpoint(cmsApiBaseUrl).request({ city: cityCode })
  }, [cityCode])
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
        ? new NotFoundError({ type: 'category', id: cityCode, city: cityCode, language: languageCode })
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
          cities={cities}
          cityCode={cityCode}
          pathname={location.pathname}
          languageCode={languageCode}
          languageChangePaths={languages.map(({ code, name }) => ({
            code,
            name,
            path: createPath(CATEGORIES_ROUTE, { cityCode, languageCode: code })
          }))}
        />
      </Layout>
    )
  }

  const cityRouteProps: CityRouteProps = { cities, languages, cityModel, languageModel }
  const { eventsEnabled, offersEnabled } = cityModel
  const localNewsEnabled = buildConfig().featureFlags.newsStream && cityModel.pushNotificationsEnabled
  const tuNewsEnabled = buildConfig().featureFlags.newsStream && cityModel.tunewsEnabled
  const poisEnabled = buildConfig().featureFlags.pois && cityModel.poisEnabled

  const suspenseLayoutProps = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths: null,
    languageCode,
    pathname: normalizePath(location.pathname),
    isLoading: true
  }

  const render = <S extends RouteType>(
    route: S,
    Component: FunctionComponent<CityRouteProps & RouteProps<S>>
  ): ((p: RouteProps<S>) => ReactNode) => (props: RouteProps<S>): ReactNode => (
    <Suspense
      fallback={
        <LocationLayout {...suspenseLayoutProps} route={route}>
          <LoadingSpinner />
        </LocationLayout>
      }>
      <Component {...cityRouteProps} {...props} />
    </Suspense>
  )

  const routes: ReactElement[] = []
  if (eventsEnabled) {
    routes.push(<Route render={render(EVENTS_ROUTE, EventsPage)} path={RoutePatterns[EVENTS_ROUTE]} exact />)
  }
  if (offersEnabled) {
    routes.push(
      <Route
        render={render(SPRUNGBRETT_OFFER_ROUTE, SprungbrettOfferPage)}
        path={RoutePatterns[SPRUNGBRETT_OFFER_ROUTE]}
        exact
      />,
      <Route render={render(OFFERS_ROUTE, OffersPage)} path={RoutePatterns[OFFERS_ROUTE]} exact />
    )
  }
  if (poisEnabled) {
    routes.push(<Route render={render(POIS_ROUTE, PoisPage)} path={RoutePatterns[POIS_ROUTE]} exact />)
  }
  if (localNewsEnabled) {
    routes.push(<Route render={render(LOCAL_NEWS_ROUTE, LocalNewsPage)} path={RoutePatterns[LOCAL_NEWS_ROUTE]} exact />)
  }
  if (tuNewsEnabled) {
    routes.push(
      <Route render={render(TU_NEWS_ROUTE, TuNewsPage)} path={RoutePatterns[TU_NEWS_ROUTE]} exact />,
      <Route render={render(TU_NEWS_DETAIL_ROUTE, TuNewsDetailPage)} path={RoutePatterns[TU_NEWS_DETAIL_ROUTE]} exact />
    )
  }
  routes.push(
    <Route render={render(SEARCH_ROUTE, SearchPage)} path={RoutePatterns[SEARCH_ROUTE]} exact />,
    <Route render={render(DISCLAIMER_ROUTE, DisclaimerPage)} path={RoutePatterns[DISCLAIMER_ROUTE]} exact />,
    <Route render={render(CATEGORIES_ROUTE, CategoriesPage)} path={RoutePatterns[CATEGORIES_ROUTE]} />
  )
  return <Switch>{routes}</Switch>
}

export default CityContentSwitcher
