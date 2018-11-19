// @flow

import RouteConfig from './RouteConfig'
import citiesEndpoint from '../../endpoint/endpoints/cities'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import type { AllPayloadsType, GetPageTitleParamsType } from './RouteConfig'
import Payload from '../../endpoint/Payload'
import CityModel from '../../endpoint/models/CityModel'

type LandingRouteParamsType = {|language: string|}
type RequiredPayloadsType = {|cities: Payload<Array<CityModel>>|}

export const LANDING_ROUTE = 'LANDING'

const getLandingPath = ({language}: LandingRouteParamsType): string => `/landing/${language}`

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

const getPageTitle = ({t}: GetPageTitleParamsType) => t('pageTitles.landing')

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({cities: payloads.citiesPayload})

class LandingRouteConfig extends RouteConfig<LandingRouteParamsType, RequiredPayloadsType> {
  constructor () {
    super({
      name: LANDING_ROUTE,
      route: landingRoute,
      getRoutePath: getLandingPath,
      getPageTitle,
      getLanguageChangePath: () => null,
      getRequiredPayloads
    })
  }
}

export default LandingRouteConfig
