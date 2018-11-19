// @flow

import RouteConfig from './RouteConfig'
import citiesEndpoint from '../../endpoint/endpoints/cities'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import type { GetPageTitleParamsType } from './RouteConfig'

type LandingRouteParamsType = {|language: string|}

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

class LandingRouteConfig extends RouteConfig<LandingRouteParamsType> {
  constructor () {
    super({
      name: LANDING_ROUTE,
      route: landingRoute,
      getRoutePath: getLandingPath,
      getPageTitle,
      getLanguageChangePath: () => null
    })
  }
}

export default LandingRouteConfig
