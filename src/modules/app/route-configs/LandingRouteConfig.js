// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import { CityModel, createCitiesEndpoint, Payload } from '@integreat-app/integreat-api-client'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import { integreatApiBaseUrl } from '../constants/urls'

type LandingRouteParamsType = {|language: string|}
type RequiredPayloadsType = {|cities: Payload<Array<CityModel>>|}

export const LANDING_ROUTE = 'LANDING'

/**
 * LandingRoute, matches /landing/de
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const landingRoute: Route = {
  path: '/landing/:language',
  thunk: async (dispatch, getState) => {
    await fetchData(createCitiesEndpoint(integreatApiBaseUrl), dispatch, getState().cities)
  }
}

class LandingRouteConfig implements RouteConfig<LandingRouteParamsType, RequiredPayloadsType> {
  name = LANDING_ROUTE
  route = landingRoute
  isLocationLayoutRoute = false
  requiresHeader = false
  requiresFooter = true

  getPageTitle = ({t}) => t('pageTitles.landing')

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({cities: payloads.citiesPayload})

  getRoutePath = ({language}: LandingRouteParamsType): string => `/landing/${language}`

  getLanguageChangePath = () => null

  getMetaDescription = t => t('metaDescription')

  getFeedbackTargetInformation = () => null
}

export default LandingRouteConfig
