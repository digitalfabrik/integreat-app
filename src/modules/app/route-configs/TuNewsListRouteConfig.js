// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createTuNewsListEndpoint,
  createLanguagesEndpoint,
  TuNewsModel,
  Payload
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl, tuNewsApiBaseUrl } from '../constants/urls'

type TuNewsListRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| news: Payload<Array<TuNewsModel>> |}

export const TUNEWS_LIST_ROUTE = "TUNEWS_LIST"

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const tuNewsListRoute: Route = {
  path: '/:city/:language/news/tu-news',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createTuNewsListEndpoint(tuNewsApiBaseUrl), dispatch, state.tunewsList, { page: 1, language: language || 'en', count: 20 }),
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language })
    ])
  }
}

class TuNewsListRouteConfig implements RouteConfig<TuNewsListRouteParamsType, RequiredPayloadsType> {
  name = TUNEWS_LIST_ROUTE
  route = tuNewsListRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({ location, payloads, language }) => null

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    tuNewsList: payloads.tuNewsPayload
  })

  getPageTitle = ({ t, payloads, cityName, location }) => t('pageTitles.tuNews')

  getRoutePath = ({ city, language }: NewsRouteParamsType): string => '/:city/:language/news/tu-news'

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads, location }) => null
}

export default TuNewsListRouteConfig
