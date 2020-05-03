// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createTuNewsListEndpoint,
  createLanguagesEndpoint,
  createLocalNewsEndpoint,
  TuNewsModel,
  Payload
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl, tuNewsApiBaseUrl } from '../constants/urls'

type TuNewsListRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| news: Payload<Array<TuNewsModel>> |}

export const TUNEWS_LIST_ROUTE = 'TUNEWS_LIST'

const tuNewsListRoute: Route = {
  path: '/:city/:language/news/tu-news',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload

    const promises = [
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(tuNewsApiBaseUrl, true), dispatch, state.languages, { city, language }),
      fetchData(createLocalNewsEndpoint(cmsApiBaseUrl), dispatch, state.news, { city, language })
    ]

    if (!state.tunewsList.data.length) {
      promises.push(fetchData(createTuNewsListEndpoint(tuNewsApiBaseUrl), dispatch, state.tunewsList, { page: 1, language: language || 'en', count: 20 }))
    }

    await Promise.all(promises)
  }
}

class TuNewsListRouteConfig implements RouteConfig<TuNewsListRouteParamsType, RequiredPayloadsType> {
  name = TUNEWS_LIST_ROUTE
  route = tuNewsListRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({ location, language }) =>
    this.getRoutePath({ city: location.payload.city, language })

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    tuNewsList: payloads.tuNewsPayload
  })

  getPageTitle = ({ t, payloads, cityName, location }) => t('pageTitles.tuNews')

  getRoutePath = ({ city, language }: NewsRouteParamsType): string => `/${city}/${language}/news/tu-news`

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads, location }) => null
}

export default TuNewsListRouteConfig
