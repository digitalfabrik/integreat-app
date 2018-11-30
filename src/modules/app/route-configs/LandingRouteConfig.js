// @flow

import { RouteConfig } from './RouteConfig'
import { CityModel, citiesEndpoint, Payload } from '@integreat-app/integreat-api-client'
import type { Dispatch, GetState, Route } from 'redux-first-router/dist/flow-types.js.flow'
import fetchData from '../fetchData'
import type { AllPayloadsType, GetPageTitleParamsType } from './RouteConfig'

type LandingRouteParamsType = {|language: string|}
type RequiredPayloadsType = {|cities: Payload<Array<CityModel>>|}

export const LANDING_ROUTE = 'LANDING'

/**
 * LandingRoute, matches /landing/de
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const landingRoute: Route = {
  path: '/landing/:language',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    await fetchData(citiesEndpoint, dispatch, getState().cities)
  }
}

class LandingRouteConfig implements RouteConfig<LandingRouteParamsType, RequiredPayloadsType> {
  name = LANDING_ROUTE
  route = landingRoute
  isLocationLayoutRoute = false
  requiresHeader = false
  requiresFooter = true

  getPageTitle = ({t}: GetPageTitleParamsType<RequiredPayloadsType>) => t('pageTitles.landing')

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({cities: payloads.citiesPayload})

  getRoutePath = ({language}: LandingRouteParamsType): string => `/landing/${language}`

  getLanguageChangePath = () => null

  getMetaDescription = t => t('metaDescription')

  getFeedbackReference = () => null
}

export default LandingRouteConfig
