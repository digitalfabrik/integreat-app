// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createTunewsEndpoint,
  createTunewsLanguagesEndpoint,
  TunewsModel,
  Payload
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl, tunewsApiBaseUrl } from '../constants/urls'

type TunewsListRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| tunews: Payload<Array<TunewsModel>> |}

export const TUNEWS_ROUTE = 'TUNEWS_LIST'

const tunewsListRoute: Route = {
  path: '/:city/:language/news/tu-news',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createTunewsLanguagesEndpoint(tunewsApiBaseUrl, true), dispatch, state.languages, { city, language }),
      fetchData(createTunewsEndpoint(tunewsApiBaseUrl), dispatch, state.tunews, { page: 1, language: language, count: 20 })
    ])
  }
}

class TunewsRouteConfig implements RouteConfig<TunewsListRouteParamsType, RequiredPayloadsType> {
  name = TUNEWS_ROUTE
  route = tunewsListRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({ location, language }) =>
    this.getRoutePath({ city: location.payload.city, language })

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    tunews: payloads.tunewsPayload
  })

  getPageTitle = ({ t, cityName }) => {
    if (!cityName) {
      return null
    }
    return `${t('pageTitles.tunews')} - ${cityName}`
  }

  getRoutePath = ({ city, language }: TunewsListRouteParamsType): string => `/${city}/${language}/news/tu-news`

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default TunewsRouteConfig
