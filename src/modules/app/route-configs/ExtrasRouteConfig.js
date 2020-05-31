// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import {
  CityModel,
  createCitiesEndpoint,
  createEventsEndpoint,
  createExtrasEndpoint,
  createLanguagesEndpoint,
  ExtraModel,
  Payload
} from '@integreat-app/integreat-api-client'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import { cmsApiBaseUrl } from '../constants/urls'

type ExtrasRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| extras: Payload<Array<ExtraModel>>, cities: Payload<Array<CityModel>> |}

export const EXTRAS_ROUTE = 'EXTRAS'

/**
 * ExtrasRoute, matches /augsburg/de/extras and /augsburg/de/extras
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const extrasRoute: Route = {
  path: '/:city/:language/extras/:extraId?',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language }),
      fetchData(createExtrasEndpoint(cmsApiBaseUrl), dispatch, state.extras, { city, language })
    ])
  }
}

class ExtrasRouteConfig implements RouteConfig<ExtrasRouteParamsType, RequiredPayloadsType> {
  name = EXTRAS_ROUTE
  route = extrasRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRoutePath = ({ city, language }: ExtrasRouteParamsType): string => `/${city}/${language}/extras`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    cities: payloads.citiesPayload,
    extras: payloads.extrasPayload
  })

  getLanguageChangePath = ({ location, language }) =>
    this.getRoutePath({ city: location.payload.city, language })

  getPageTitle = ({ t, payloads, location }) => {
    const cityModel = payloads.cities.data
      ? payloads.cities.data.find(cityModel => cityModel.code === location.payload.city)
      : null
    if (!cityModel || !cityModel.extrasEnabled) {
      return null
    }
    return `${t('pageTitles.extras')} - ${cityModel.name}`
  }

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default ExtrasRouteConfig
