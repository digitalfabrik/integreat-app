import React, { ReactElement, Suspense, useCallback } from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import {
  CATEGORIES_ROUTE,
  CityModel,
  createLanguagesEndpoint,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  LanguageModel,
  normalizePath,
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
import { createPath, LOCAL_NEWS_ROUTE, RoutePatterns, TU_NEWS_DETAIL_ROUTE, TU_NEWS_ROUTE } from './routes'
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
      const cityError = !cityModel ? new Error('notFound.category') : null
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

  const params = { cities, languages, cityModel, languageModel }
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

  const routes = [
    ...(eventsEnabled ? [{ route: EVENTS_ROUTE, render: props => <EventsPage {...props} {...params} /> }] : []),
    ...(offersEnabled
      ? [
          { route: SPRUNGBRETT_OFFER_ROUTE, render: props => <SprungbrettOfferPage {...props} {...params} /> },
          { route: OFFERS_ROUTE, render: props => <OffersPage {...props} {...params} /> }
        ]
      : []),
    ...(poisEnabled ? [{ route: POIS_ROUTE, render: props => <PoisPage {...props} {...params} /> }] : []),
    ...(localNewsEnabled
      ? [{ route: LOCAL_NEWS_ROUTE, render: props => <LocalNewsPage {...props} {...params} /> }]
      : []),
    ...(tuNewsEnabled
      ? [
          { route: TU_NEWS_ROUTE, render: props => <TuNewsPage {...props} {...params} /> },
          { route: TU_NEWS_DETAIL_ROUTE, render: props => <TuNewsDetailPage {...props} {...params} /> }
        ]
      : []),
    { route: SEARCH_ROUTE, render: props => <SearchPage {...props} {...params} /> },
    { route: DISCLAIMER_ROUTE, render: props => <DisclaimerPage {...props} {...params} /> },
    { route: CATEGORIES_ROUTE, render: props => <CategoriesPage {...props} {...params} />, exact: false }
  ]

  return (
    <Switch>
      {routes.map(({ exact = true, route, render }) => (
        <Route
          key={route}
          exact={exact}
          path={RoutePatterns[route]}
          render={props => (
            <Suspense
              fallback={
                <LocationLayout {...suspenseLayoutProps} route={route}>
                  <LoadingSpinner />
                </LocationLayout>
              }>
              {render(props)}
            </Suspense>
          )}
        />
      ))}
    </Switch>
  )
}

export default CityContentSwitcher
