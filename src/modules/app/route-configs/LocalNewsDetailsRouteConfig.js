

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createLocalNewsElementEndpoint,
  createLanguagesEndpoint,
  LocalNewsModel,
  Payload
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl, localNewsApiBaseUrl, localNewsApiBaseUrlDev } from '../constants/urls'

type LocalNewsDetailsType = {| city: string, language: string |}
type RequiredPayloadsType = {| news: Payload<LocalNewsModel> |}

export const LOCAL_NEWS_DETAILS_ROUTE = 'LOCAL_NEWS_DETAILS'

const localNewsDetailsRoute: Route = {
  path: '/:city/:language/news/local/:id',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language, id } = state.location.payload

    await Promise.all([
      fetchData(createLocalNewsElementEndpoint(localNewsApiBaseUrlDev), dispatch, state.newsElement, { city, language, id }),
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

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({ localNewsDetails: payloads.newsElementPayload })

  getPageTitle = ({ t, payloads, cityName, location }) => null

  getRoutePath = ({ city, language }: LocalNewsDetailsType): string => null

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads, location }) => null
}

export default LocalNewsDetailsRouteConfig
