import React, { ReactElement, useCallback } from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import OffersPage from './offers/OffersPage'
import EventsPage from './events/EventsPage'
import CategoriesPage from './categories/CategoriesPage'
import PoisPage from './pois/PoisPage'
import SearchPage from './search/SearchPage'
import DisclaimerPage from './disclaimer/DisclaimerPage'
import {
  EVENTS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  LOCAL_NEWS_TYPE,
  TU_NEWS_TYPE,
  DISCLAIMER_ROUTE,
  SEARCH_ROUTE,
  CityModel,
  useLoadFromEndpoint,
  createLanguagesEndpoint,
  LanguageModel,
  CATEGORIES_ROUTE, SPRUNGBRETT_OFFER_ROUTE
} from 'api-client'
import { cmsApiBaseUrl } from '../constants/urls'
import Layout from '../components/Layout'
import FailureSwitcher from '../components/FailureSwitcher'
import LanguageFailure from '../components/LanguageFailure'
import GeneralHeader from '../components/GeneralHeader'
import GeneralFooter from '../components/GeneralFooter'
import LoadingSpinner from '../components/LoadingSpinner'
import { RoutePatterns } from './RootSwitcher'
import LocalNewsPage from './local-news/LocalNewsPage'
import TuNewsPage from './tu-news/TuNewsPage'
import SprungbrettOfferPage from './sprungbrett/SprungbrettOfferPage'

type PropsType = {
  cities: CityModel[]
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

// TODO pass right props instead of constants: viewportSmall, languageChangePaths, isLoading, feedbackTargetInformation
const CityContentSwitcher = ({ cities, match, location }: PropsType): ReactElement => {
  const { cityCode, languageCode } = match.params
  const cityModel = cities.find(it => it.code === cityCode)

  const requestLanguages = useCallback(async () => {
    return createLanguagesEndpoint(cmsApiBaseUrl).request({ city: cityCode })
  }, [cityCode])
  const { data: languages, loading, error: languagesError } = useLoadFromEndpoint<LanguageModel[]>(requestLanguages)
  const languageModel = languages?.find(it => it.code === languageCode)

  if (!cityModel || !languageModel || !languages) {
    if (loading) {
      return (
        <Layout>
          <LoadingSpinner />
        </Layout>
      )
    }

    const error = !cityModel ? new Error('notFound.category') : languagesError
    if (error) {
      return (
        <Layout
          header={<GeneralHeader languageCode={languageCode} viewportSmall={false} />}
          footer={<GeneralFooter language={languageCode} />}>
          <FailureSwitcher error={error} />
        </Layout>
      )
    }

    return (
      <Layout
        header={<GeneralHeader languageCode={languageCode} viewportSmall={false} />}
        footer={<GeneralFooter language={languageCode} />}>
        <LanguageFailure
          cities={cities}
          cityCode={cityCode}
          pathname={location.pathname}
          languageCode={languageCode}
          languageChangePaths={[
            { code: 'de', name: 'Deutsch', path: '/' },
            { code: 'fr', name: 'French', path: '/' }
          ]}
        />
      </Layout>
    )
  }

  const params = { cities, languages, cityModel, languageModel }

  return (
    <Switch>
      <Route exact path={RoutePatterns[EVENTS_ROUTE]} render={props => <EventsPage {...params} {...props} />} />
      <Route exact path={RoutePatterns[SPRUNGBRETT_OFFER_ROUTE]} render={props => <SprungbrettOfferPage {...params} {...props} />} />
      <Route exact path={RoutePatterns[OFFERS_ROUTE]} render={props => <OffersPage {...params} {...props} />} />
      <Route exact path={RoutePatterns[POIS_ROUTE]} render={props => <PoisPage {...params} {...props} />} />
      <Route exact path={RoutePatterns[LOCAL_NEWS_TYPE]} render={props => <LocalNewsPage {...params} {...props} />} />
      <Route exact path={RoutePatterns[TU_NEWS_TYPE]} render={props => <TuNewsPage {...params} {...props} />} />
      <Route exact path={RoutePatterns[SEARCH_ROUTE]} render={props => <SearchPage {...params} {...props} />} />
      <Route exact path={RoutePatterns[DISCLAIMER_ROUTE]} render={props => <DisclaimerPage {...params} {...props} />} />
      <Route path={RoutePatterns[CATEGORIES_ROUTE]} render={props => <CategoriesPage {...params} {...props} />} />
    </Switch>
  )
}

export default CityContentSwitcher
