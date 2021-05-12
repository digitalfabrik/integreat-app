// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createLocalNewsElementEndpoint,
  createLanguagesEndpoint,
  LocalNewsModel,
  Payload,
  CityModel
} from 'api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl } from '../constants/urls'
import type { StateType } from '../StateType'

type LocalNewsDetailsType = {| city: string, language: string, id: number |}
type RequiredPayloadsType = {|
  localNewsElement: Payload<LocalNewsModel>,
  cities: Payload<Array<CityModel>>
|}

export const LOCAL_NEWS_DETAILS_ROUTE = 'LOCAL_NEWS_DETAILS'

const localNewsDetailsRoute: Route = {
  path: '/:city/:language/news/local/:newsId',
  thunk: async (dispatch, getState) => {
    const state: StateType = getState()
    const { city, language, newsId } = state.location.payload

    await Promise.all([
      fetchData(createLocalNewsElementEndpoint(cmsApiBaseUrl), dispatch, state.localNewsElement, {
        city,
        language,
        id: newsId
      }),
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language })
    ])
  }
}

class LocalNewsDetailsRouteConfig implements RouteConfig<LocalNewsDetailsType, RequiredPayloadsType> {
  name = LOCAL_NEWS_DETAILS_ROUTE
  route = localNewsDetailsRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({ location, payloads, language }) => null

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    localNewsElement: payloads.localNewsElementPayload,
    cities: payloads.citiesPayload
  })

  getPageTitle = ({ payloads, cityName, location }) => {
    if (!cityName) {
      return null
    }
    const localNewsElement = payloads.localNewsElement.data
    if (!localNewsElement) {
      return null
    }
    const cityModel =
      payloads.cities.data && payloads.cities.data.find(cityModel => cityModel.code === location.payload.city)
    if (!cityModel || !cityModel.pushNotificationsEnabled) {
      return null
    }
    return `${localNewsElement.title} - ${cityName}`
  }

  getRoutePath = ({ city, language, id }: LocalNewsDetailsType): string => `/${city}/${language}/news/local/${id}`

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default LocalNewsDetailsRouteConfig
