// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createTunewsEndpoint,
  createTunewsLanguagesEndpoint,
  createLocalNewsEndpoint,
  TunewsModel,
  Payload
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl, tunewsApiBaseUrl } from '../constants/urls'

type TunewsListRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| tunews: Payload<Array<TunewsModel>> |}

export const TUNEWS_LIST_ROUTE = 'TUNEWS_LIST'

const tunewsListRoute: Route = {
  path: '/:city/:language/news/tu-news',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload

    const promises = [
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createTunewsLanguagesEndpoint(tunewsApiBaseUrl, true), dispatch, state.languages, { city, language }),
      fetchData(createLocalNewsEndpoint(cmsApiBaseUrl), dispatch, state.localNews, { city, language })
    ]

    if (!state.tunews.data.length) {
      promises.push(fetchData(createTunewsEndpoint(tunewsApiBaseUrl), dispatch, state.tunews, { page: 1, language: language || 'en', count: 20 }))
    }

    await Promise.all(promises)
  }
}

class TunewsListRouteConfig implements RouteConfig<TunewsListRouteParamsType, RequiredPayloadsType> {
  name = TUNEWS_LIST_ROUTE
  route = tunewsListRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({ location, language }) =>
    this.getRoutePath({ city: location.payload.city, language })

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    tunews: payloads.tunewsPayload
  })

  getPageTitle = ({ t, payloads, cityName, location }) => t('pageTitles.tunews')

  getRoutePath = ({ city, language }: TunewsListRouteParamsType): string => `/${city}/${language}/news/tu-news`

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads, location }) => null
}

export default TunewsListRouteConfig
