

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
import { cmsApiBaseUrl, tunewsApiBaseUrl } from '../constants/urls'

type TuNewsListRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| news: Payload<Array<TuNewsModel>> |}

export const TUNEWS_LIST_ROUTE = "TUNEWS_LIST"

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const tunewsListRoute: Route = {
  path: '/:city/:language/news/tu-news',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload
    console.log('city',city, language)

    await Promise.all([
      fetchData(createTuNewsListEndpoint(tunewsApiBaseUrl), dispatch, state.tunews_list, { page: 1, language: language || 'en', count: 20 }),
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language })
    ])
  }
}

class TuNewsListRouteConfig implements RouteConfig<TuNewsListRouteParamsType, RequiredPayloadsType> {
  name = TUNEWS_LIST_ROUTE
  route = tunewsListRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({ location, payloads, language }) => {
    console.log('location-tuNewsList', location)
    console.log('payloads-tuNewsList', payloads)
    console.log('language-tuNewsList', language)
  }

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    tuNewsList: payloads.tuNewsPayload
  })

  getPageTitle = ({ t, payloads, cityName, location }) => {
    if (!cityName) {
      return null
    }
  }

  getRoutePath = ({ city, language }: NewsRouteParamsType): string => null

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads, location }) => {
  }
}

export default TuNewsListRouteConfig
