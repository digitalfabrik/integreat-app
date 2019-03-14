// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createExtrasEndpoint,
  createLanguagesEndpoint,
  ExtraModel,
  Payload
} from '@integreat-app/integreat-api-client'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import { integreatApiBaseUrl } from '../constants/urls'

type ExtrasRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|extras: Payload<Array<ExtraModel>>|}

export const EXTRAS_ROUTE = 'EXTRAS'

/**
 * ExtrasRoute, matches /augsburg/de/extras and /augsburg/de/extras
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const extrasRoute: Route = {
  path: '/:city/:language/extras/:extraId?',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await Promise.all([
      fetchData(createCitiesEndpoint(integreatApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(integreatApiBaseUrl), dispatch, state.events, {city, language}),
      fetchData(createLanguagesEndpoint(integreatApiBaseUrl), dispatch, state.languages, {city, language}),
      fetchData(createExtrasEndpoint(integreatApiBaseUrl), dispatch, state.extras, {city, language})
    ])
  }
}

class ExtrasRouteConfig implements RouteConfig<ExtrasRouteParamsType, RequiredPayloadsType> {
  name = EXTRAS_ROUTE
  route = extrasRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRoutePath = ({city, language}: ExtrasRouteParamsType): string => `/${city}/${language}/extras`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({extras: payloads.extrasPayload})

  getLanguageChangePath = ({location, language}) =>
    this.getRoutePath({city: location.payload.city, language})

  getPageTitle = ({t, cityName}) => cityName ? `${t('pageTitles.extras')} - ${cityName}` : null

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default ExtrasRouteConfig
