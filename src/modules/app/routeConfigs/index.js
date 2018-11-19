// @flow

import type { Route } from 'redux-first-router'
import RouteConfig from './RouteConfig'
import CategoriesRouteConfig, { CATEGORIES_ROUTE } from './categories'
import I18nRedirectRouteConfig, { I18N_REDIRECT_ROUTE } from './i18nRedirect'
import LandingRouteConfig, { LANDING_ROUTE } from './landing'
import MainDisclaimerRouteConfig, { MAIN_DISCLAIMER_ROUTE } from './mainDisclaimer'
import EventsRouteConfig, { EVENTS_ROUTE } from './events'
import WohnenRouteConfig, { WOHNEN_ROUTE } from './wohnen'
import ExtrasRouteConfig, { EXTRAS_ROUTE } from './extras'
import SearchRouteConfig, { SEARCH_ROUTE } from './search'
import PoisRouteConfig, { POIS_ROUTE } from './pois'
import DisclaimerRouteConfig, { DISCLAIMER_ROUTE } from './disclaimer'
import SprungbrettRouteConfig, { SPRUNGBRETT_ROUTE } from './sprungbrett'

export const LocationLayoutRoutes = [CATEGORIES_ROUTE, EVENTS_ROUTE, EXTRAS_ROUTE, SPRUNGBRETT_ROUTE, WOHNEN_ROUTE,
  DISCLAIMER_ROUTE, SEARCH_ROUTE, POIS_ROUTE]

export const routeConfigs: {[string]: RouteConfig<any, any>} = {
  [MAIN_DISCLAIMER_ROUTE]: new MainDisclaimerRouteConfig(),
  [I18N_REDIRECT_ROUTE]: new I18nRedirectRouteConfig(),
  [LANDING_ROUTE]: new LandingRouteConfig(),
  [EVENTS_ROUTE]: new EventsRouteConfig(),
  [SPRUNGBRETT_ROUTE]: new SprungbrettRouteConfig(),
  [WOHNEN_ROUTE]: new WohnenRouteConfig(),
  [EXTRAS_ROUTE]: new ExtrasRouteConfig(),
  [DISCLAIMER_ROUTE]: new DisclaimerRouteConfig(),
  [SEARCH_ROUTE]: new SearchRouteConfig(),
  [POIS_ROUTE]: new PoisRouteConfig(),
  [CATEGORIES_ROUTE]: new CategoriesRouteConfig()
}

export const getRouteConfig = (routeName: string): RouteConfig<*, *> => {
  const routeConfig = routeConfigs[routeName]
  if (!routeConfig) {
    throw new Error(
      `There is no route config with the name ${routeName}. Did you forget to add it in the routes index?`)
  }
  return routeConfig
}

export const routesMap: {[string]: Route} = {
  [MAIN_DISCLAIMER_ROUTE]: new MainDisclaimerRouteConfig().route,
  [I18N_REDIRECT_ROUTE]: new I18nRedirectRouteConfig().route,
  [LANDING_ROUTE]: new LandingRouteConfig().route,
  [EVENTS_ROUTE]: new EventsRouteConfig().route,
  [SPRUNGBRETT_ROUTE]: new SprungbrettRouteConfig().route,
  [WOHNEN_ROUTE]: new WohnenRouteConfig().route,
  [EXTRAS_ROUTE]: new ExtrasRouteConfig().route,
  [DISCLAIMER_ROUTE]: new DisclaimerRouteConfig().route,
  [SEARCH_ROUTE]: new SearchRouteConfig().route,
  [POIS_ROUTE]: new PoisRouteConfig().route,
  [CATEGORIES_ROUTE]: new CategoriesRouteConfig().route
}
