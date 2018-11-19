// @flow

import type { Route } from 'redux-first-router'
import RouteConfig from './RouteConfig'
import CategoriesRouteConfig, { CATEGORIES_ROUTE } from './categories'
import I18nRedirectRouteConfig from './i18nRedirect'
import LandingRouteConfig from './landing'
import MainDisclaimerRouteConfig from './mainDisclaimer'
import EventsRouteConfig, { EVENTS_ROUTE } from './events'
import WohnenRouteConfig, { WOHNEN_ROUTE } from './wohnen'
import ExtrasRouteConfig, { EXTRAS_ROUTE } from './extras'
import SearchRouteConfig, { SEARCH_ROUTE } from './search'
import PoisRouteConfig, { POIS_ROUTE } from './pois'
import DisclaimerRouteConfig, { DISCLAIMER_ROUTE } from './disclaimer'
import SprungbrettRouteConfig, { SPRUNGBRETT_ROUTE } from './sprungbrett'
import reduce from 'lodash/reduce'

export const LocationLayoutRoutes = [CATEGORIES_ROUTE, EVENTS_ROUTE, EXTRAS_ROUTE, SPRUNGBRETT_ROUTE, WOHNEN_ROUTE,
  DISCLAIMER_ROUTE, SEARCH_ROUTE, POIS_ROUTE]

const routeConfigs: Array<RouteConfig<any>> = [
  new MainDisclaimerRouteConfig(),
  new I18nRedirectRouteConfig(),
  new LandingRouteConfig(),
  new EventsRouteConfig(),
  new SprungbrettRouteConfig(),
  new WohnenRouteConfig(),
  new ExtrasRouteConfig(),
  new DisclaimerRouteConfig(),
  new SearchRouteConfig(),
  new PoisRouteConfig(),
  new CategoriesRouteConfig()
]

export const getRouteConfig = (routeName: string): Route<*> => {
  const routeConfig = routeConfigs.find(config => config.name === routeName)
  if (!routeConfig) {
    throw new Error(
      `There is no route config with the name ${routeName}. Did you forget to add it in the routes index?`)
  }
  return routeConfig
}

export const routesMap: {[string]: Route} =
  reduce(routeConfigs, (result, value) => ({[value.name]: value.route, ...result}), {})
