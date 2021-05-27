import React, { ReactElement, useCallback } from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import OffersPage from './offers/OffersPage'
import EventsPage from './events/EventsPage'
import CategoriesPage from './categories/CategoriesPage'
import PoisPage from './pois/PoisPage'
import NewsPage from './news/NewsPage'
import SearchPage from './search/SearchPage'
import DisclaimerPage from './disclaimer/DisclaimerPage'
import {
  EVENTS_ROUTE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  LOCAL_NEWS_TYPE,
  TU_NEWS_TYPE,
  DISCLAIMER_ROUTE,
  SEARCH_ROUTE,
  CityModel,
  useLoadFromEndpoint,
  createLanguagesEndpoint,
  LanguageModel
} from 'api-client'
import { cmsApiBaseUrl } from '../constants/urls'
import Layout from '../components/Layout'
import FailureSwitcher from '../components/FailureSwitcher'
import { LanguageFailure } from '../components/LanguageFailure'

type PropsType = {
  cities: CityModel[]
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

const CityContentSwitcher = (props: PropsType): ReactElement => {
  const { cities, match, location } = props
  const { cityCode, languageCode } = match.params
  const cityModel = cities.find(it => it.code === cityCode)

  const requestLanguages = useCallback(async () => {
    return createLanguagesEndpoint(cmsApiBaseUrl).request({ city: cityCode })
  }, [cityCode])
  const { data: languages, loading, error: languagesError } = useLoadFromEndpoint<LanguageModel[]>(requestLanguages)
  const languageModel = languages?.find(it => it.code === languageCode)

  if (!cityModel || !languageModel) {
    if (loading) {
      return <>CityContentRouter loading!</>
    }

    const error = !cityModel ? new Error('notFound.category') : languagesError
    if (error) {
      return <Layout><FailureSwitcher error={error} /></Layout>
    }

    return (
      <Layout>
        <LanguageFailure
          cities={cities}
          cityCode={cityCode}
          pathname={location.pathname}
          languageCode={languageCode}
          // TODO
          languageChangePaths={[]}
          t={key => key}
        />
      </Layout>
    )
  }

  return (
    <Switch>
      <Route path={`/${EVENTS_ROUTE}/:eventId?`} exact component={EventsPage} />
      <Route path={`/${OFFERS_ROUTE}/:offerId?`} exact component={OffersPage} />
      <Route path={`/${POIS_ROUTE}/:locationId?`} exact component={PoisPage} />
      <Route path={`/${NEWS_ROUTE}/${LOCAL_NEWS_TYPE}/:newsId?`} exact component={NewsPage} />
      <Route path={`/${NEWS_ROUTE}/${TU_NEWS_TYPE}/:newsId?`} exact component={NewsPage} />
      <Route path={`/${SEARCH_ROUTE}`} exact component={SearchPage} />
      <Route path={`/${DISCLAIMER_ROUTE}`} exact component={DisclaimerPage} />
      <Route path={`/:categoriesId*`} component={CategoriesPage} />
    </Switch>
  )
}

export default CityContentSwitcher
