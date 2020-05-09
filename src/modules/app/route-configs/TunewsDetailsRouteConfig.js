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

type TunewsDetailsRouteParamsType = {|city: string, language: string, id: string|}
type RequiredPayloadsType = {| tunewsElementDetails: Payload<TunewsModel> |}

export const TUNEWS_DETAILS_ROUTE = 'TUNEWS_DETAILS'

const tunewsDetailsRoute: Route = {
  path: '/:city/:language/news/tu-news/:newsId',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const newsId = state.location.payload.newsId
    const { city, language } = state.location.payload

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
    ({ tunewsElementDetails: payloads.tunewsElementPayload })

  getPageTitle = ({ payloads, cityName }) => {
    if (!cityName) {
      return null
    }
    const tunewsElementDetails = payloads.tunewsElementDetails.data
    if (!tunewsElementDetails) {
      return null
    }
    return `${tunewsElementDetails.title} - ${cityName}`
  }

  getRoutePath = ({ city, language }) => null

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads }) => {
    const tunewsElementDetails = payloads.tunewsElementDetails && payloads.tunewsElementDetails.data
    return tunewsElementDetails ? { title: tunewsElementDetails.title } : null
  }
}

export default TunewsDetailsRouteConfig
