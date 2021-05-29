import React, { ReactElement, useCallback } from 'react'
import { Route, RouteComponentProps, Switch, generatePath } from 'react-router-dom'
import OffersPage from './offers/OffersPage'
import EventsPage from './events/EventsPage'
import CategoriesPage from './categories/CategoriesPage'
import PoisPage from './pois/PoisPage'
import NewsPage from './news/NewsPage'
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
  CATEGORIES_ROUTE,
  LANDING_ROUTE
} from 'api-client'
import { cmsApiBaseUrl } from '../constants/urls'
import Layout from '../components/Layout'
import FailureSwitcher from '../components/FailureSwitcher'
import { LanguageFailure } from '../components/LanguageFailure'
import GeneralHeader from '../components/GeneralHeader'
import GeneralFooter from '../components/GeneralFooter'
import LocationLayout from '../components/LocationLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import { cityContentPattern, RoutePatterns } from './RootSwitcher'

type PropsType = {
  cities: CityModel[]
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

// TODO pass right props instead of constants
const CityContentSwitcher = (props: PropsType): ReactElement => {
  const { cities, match, location } = props
  const { cityCode, languageCode } = match.params
  const cityModel = cities.find(it => it.code === cityCode)

  const requestLanguages = useCallback(async () => {
    return createLanguagesEndpoint(cmsApiBaseUrl).request({ city: cityCode })
  }, [cityCode])
  const { data: languages, loading, error: languagesError } = useLoadFromEndpoint<LanguageModel[]>(requestLanguages)
  const languageModel = languages?.find(it => it.code === languageCode)

  const landingPath = generatePath(RoutePatterns[LANDING_ROUTE], { languageCode })

  if (!cityModel || !languageModel) {
    if (loading) {
      return (
        <Layout header={<GeneralHeader landingPath={landingPath} viewportSmall={false} />} footer={<GeneralFooter language={languageCode} />}>
          <LoadingSpinner />
        </Layout>
      )
    }

    const error = !cityModel ? new Error('notFound.category') : languagesError
    if (error) {
      return (
        <Layout header={<GeneralHeader landingPath={landingPath} viewportSmall={false} />} footer={<GeneralFooter language={languageCode} />}>
          <FailureSwitcher error={error} />
        </Layout>
      )
    }

    return (
      <Layout header={<GeneralHeader landingPath={landingPath} viewportSmall={false} />} footer={<GeneralFooter language={languageCode} />}>
        <LanguageFailure
          cities={cities}
          cityCode={cityCode}
          pathname={location.pathname}
          languageCode={languageCode}
          languageChangePaths={[
            { code: 'de', name: 'Deutsch', path: '/' },
            { code: 'fr', name: 'French', path: '/' }
          ]}
          t={key => key}
        />
      </Layout>
    )
  }

  const stripCityContentPattern = (pattern: string) => pattern.replace(cityContentPattern, '')

  return (
    <LocationLayout
      cities={cities}
      categories={null}
      viewportSmall={false}
      feedbackTargetInformation={null}
      languageChangePaths={null}
      isLoading={false}
      cityCode={cityCode}
      languageCode={languageCode}
      pathname={location.pathname}>
      <Switch>
        <Route exact path={stripCityContentPattern(RoutePatterns[EVENTS_ROUTE])} component={EventsPage} />
        <Route exact path={stripCityContentPattern(RoutePatterns[OFFERS_ROUTE])} component={OffersPage} />
        <Route exact path={stripCityContentPattern(RoutePatterns[POIS_ROUTE])} component={PoisPage} />
        <Route exact path={stripCityContentPattern(RoutePatterns[LOCAL_NEWS_TYPE])} component={NewsPage} />
        <Route exact path={stripCityContentPattern(RoutePatterns[TU_NEWS_TYPE])} component={NewsPage} />
        <Route exact path={stripCityContentPattern(RoutePatterns[SEARCH_ROUTE])} component={SearchPage} />
        <Route exact path={stripCityContentPattern(RoutePatterns[DISCLAIMER_ROUTE])} component={DisclaimerPage} />
        <Route path={stripCityContentPattern(RoutePatterns[CATEGORIES_ROUTE])} component={CategoriesPage} />
      </Switch>
    </LocationLayout>
  )
}

export default CityContentSwitcher
