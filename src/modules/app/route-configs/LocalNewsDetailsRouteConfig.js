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
  Payload
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl } from '../constants/urls'

type LocalNewsDetailsType = {| city: string, language: string |}
type RequiredPayloadsType = {| localNewsDetails: Payload<LocalNewsModel> |}

export const LOCAL_NEWS_DETAILS_ROUTE = 'LOCAL_NEWS_DETAILS'

const localNewsDetailsRoute: Route = {
  path: '/:city/:language/news/local/:id',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language, id } = state.location.payload

    await Promise.all([
      fetchData(createLocalNewsElementEndpoint(cmsApiBaseUrl), dispatch, state.localNewsElement, { city, language, id }),
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

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({ localNewsDetails: payloads.localNewsElementPayload })

  getPageTitle = ({ payloads, cityName }) => {
    if (!cityName) {
      return null
    }
    const localNewsDetails = payloads.localNewsDetails.data
    if (!localNewsDetails) {
      return null
    }
    return `${localNewsDetails.title} - ${cityName}`
  }

  getRoutePath = ({ city, language }: LocalNewsDetailsType): string => ''

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads, location }) => {
    const localNewsDetails = payloads.localNewsDetails && payloads.localNewsDetails.data
    return localNewsDetails ? { title: localNewsDetails.title } : null
  }
}

export default LocalNewsDetailsRouteConfig
