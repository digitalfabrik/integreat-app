import React, { ReactElement, useCallback } from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import OffersPage from './routes/OffersPage'
import EventsPage from './routes/EventsPage'
import CategoriesPage from './routes/CategoriesPage'
import PoisPage from './routes/PoisPage'
import SearchPage from './routes/SearchPage'
import DisclaimerPage from './routes/DisclaimerPage'
import {
  CATEGORIES_ROUTE,
  CityModel,
  createLanguagesEndpoint,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  LanguageModel,
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
import LocalNewsPage from './routes/LocalNewsPage'
import TuNewsPage from './routes/TuNewsPage'
import SprungbrettOfferPage from './routes/SprungbrettOfferPage'
import { createPath, LOCAL_NEWS_ROUTE, RoutePatterns, TU_NEWS_DETAIL_ROUTE, TU_NEWS_ROUTE } from './routes'
import buildConfig from './constants/buildConfig'
import TuNewsDetailPage from './routes/TuNewsDetailPage'

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

  return (
    <Switch>
      {eventsEnabled && (
        <Route exact path={RoutePatterns[EVENTS_ROUTE]} render={props => <EventsPage {...params} {...props} />} />
      )}
      {offersEnabled && (
        <Route
          exact
          path={RoutePatterns[SPRUNGBRETT_OFFER_ROUTE]}
          render={props => <SprungbrettOfferPage {...params} {...props} />}
        />
      )}
      {offersEnabled && (
        <Route exact path={RoutePatterns[OFFERS_ROUTE]} render={props => <OffersPage {...params} {...props} />} />
      )}
      {poisEnabled && (
        <Route exact path={RoutePatterns[POIS_ROUTE]} render={props => <PoisPage {...params} {...props} />} />
      )}
      {localNewsEnabled && (
        <Route exact path={RoutePatterns[LOCAL_NEWS_ROUTE]} render={props => <LocalNewsPage {...params} {...props} />} />
      )}
      {tuNewsEnabled && (
        <Route exact path={RoutePatterns[TU_NEWS_ROUTE]} render={props => <TuNewsPage {...params} {...props} />} />
      )}
      {tuNewsEnabled && (
        <Route
          exact
          path={RoutePatterns[TU_NEWS_DETAIL_ROUTE]}
          render={props => <TuNewsDetailPage {...params} {...props} />}
        />
      )}
      <Route exact path={RoutePatterns[SEARCH_ROUTE]} render={props => <SearchPage {...params} {...props} />} />
      <Route exact path={RoutePatterns[DISCLAIMER_ROUTE]} render={props => <DisclaimerPage {...params} {...props} />} />
      <Route path={RoutePatterns[CATEGORIES_ROUTE]} render={props => <CategoriesPage {...params} {...props} />} />
    </Switch>
  )
}

export default CityContentSwitcher
