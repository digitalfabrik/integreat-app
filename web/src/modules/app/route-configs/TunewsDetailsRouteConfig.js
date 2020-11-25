// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  TunewsModel,
  Payload,
  createTunewsElementEndpoint,
  createCitiesEndpoint,
  createEventsEndpoint, CityModel
} from 'api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl, tunewsApiBaseUrl } from '../constants/urls'
import type { StateType } from '../StateType'

type TunewsDetailsRouteParamsType = {| city: string, language: string, id: number |}
type RequiredPayloadsType = {|
  tunewsElement: Payload<TunewsModel>,
  cities: Payload<Array<CityModel>>
|}

export const TUNEWS_DETAILS_ROUTE = 'TUNEWS_DETAILS'

const tunewsDetailsRoute: Route = {
  path: '/:city/:language/news/tu-news/:newsId',
  thunk: async (dispatch, getState) => {
    const state: StateType = getState()
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

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    tunewsElement: payloads.tunewsElementPayload,
    cities: payloads.citiesPayload
  })

  getPageTitle = ({ payloads, cityName, location }) => {
    if (!cityName) {
      return null
    }
    const tunewsElement = payloads.tunewsElement.data
    if (!tunewsElement) {
      return null
    }
    const cityModel = payloads.cities.data &&
      payloads.cities.data.find(cityModel => cityModel.code === location.payload.city)
    if (!cityModel || !cityModel.tunewsEnabled) {
      return null
    }
    return `${tunewsElement.title} - ${cityName}`
  }

  getRoutePath = ({ city, language, id }): string => `/${city}/${language}/news/tu-news/${id}`

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default TunewsDetailsRouteConfig
