// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  TunewsModel,
  Payload,
  createTunewsElementEndpoint,
  createCitiesEndpoint,
  createEventsEndpoint
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl, tunewsApiBaseUrl } from '../constants/urls'

type TunewsDetailsRouteParamsType = {| city: string, language: string, id: number |}
type RequiredPayloadsType = {| tunewsElement: Payload<TunewsModel> |}

export const TUNEWS_DETAILS_ROUTE = 'TUNEWS_DETAILS'

const tunewsDetailsRoute: Route = {
  path: '/:city/:language/news/tu-news/:newsId',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language, newsId } = state.location.payload

    await Promise.all([
      fetchData(createTunewsElementEndpoint(tunewsApiBaseUrl), dispatch, state.tunewsElement, { id: newsId }),
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language })
    ])
  }
}

class TunewsDetailsRouteConfig implements RouteConfig<TunewsDetailsRouteParamsType, RequiredPayloadsType> {
  name = TUNEWS_DETAILS_ROUTE
  route = tunewsDetailsRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = () => null

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType =>
    ({ tunewsElement: payloads.tunewsElementPayload })

  getPageTitle = ({ payloads, cityName }) => {
    if (!cityName) {
      return null
    }
    const tunewsElement = payloads.tunewsElement.data
    if (!tunewsElement) {
      return null
    }
    return `${tunewsElement.title} - ${cityName}`
  }

  getRoutePath = ({ city, language, id }): string => `/${city}/${language}/news/tu-news/${id}`

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default TunewsDetailsRouteConfig
