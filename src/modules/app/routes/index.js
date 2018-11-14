// @flow

import categoriesRoute, { CATEGORIES_ROUTE, route as categories } from './categories'
import eventsRoute, { EVENTS_ROUTE, route as events } from './events'
import extrasRoute, { EXTRAS_ROUTE, route as extras } from './extras'
import disclaimerRoute, { DISCLAIMER_ROUTE, route as disclaimer } from './disclaimer'
import poisRoute, { POIS_ROUTE, route as pois } from './pois'
import sprungbrettRoute, { SPRUNGBRETT_ROUTE, route as sprungbrett } from './sprungbrett'
import wohnenRoute, { WOHNEN_ROUTE, route as wohnen } from './wohnen'
import searchRoute, { SEARCH_ROUTE, route as search } from './search'
import mainDisclaimerRoute, { MAIN_DISCLAIMER_ROUTE, route as mainDisclaimer } from './mainDisclaimer'
import i18nRedirectRoute, { I18N_REDIRECT_ROUTE, route as i18nRedirect } from './i18nRedirect'
import landingRoute, { LANDING_ROUTE, route as landing } from './landing'
import type { Route as RouterRouteType } from 'redux-first-router'
import Route from './Route'
import type { GetLanguageChangePathParamsType } from './types'
// this maps all goToRoute actions to the right routes (except from the NOT_FOUND route)
// the order is important, routes declared first are served first, so i.e. if you put the mainDisclaimer route after
// the i18nRedirect route, "/disclaimer" also matches the i18nRedirect route
export const routesMap: {[string]: RouterRouteType} = {
  [MAIN_DISCLAIMER_ROUTE]: mainDisclaimer,
  [I18N_REDIRECT_ROUTE]: i18nRedirect,
  [LANDING_ROUTE]: landing,
  [EVENTS_ROUTE]: events,
  [SPRUNGBRETT_ROUTE]: sprungbrett,
  [WOHNEN_ROUTE]: wohnen,
  [EXTRAS_ROUTE]: extras,
  [DISCLAIMER_ROUTE]: disclaimer,
  [SEARCH_ROUTE]: search,
  [POIS_ROUTE]: pois,
  [CATEGORIES_ROUTE]: categories
}

const routes: {[string]: Route<any, any>} = {
  [MAIN_DISCLAIMER_ROUTE]: mainDisclaimerRoute,
  [I18N_REDIRECT_ROUTE]: i18nRedirectRoute,
  [LANDING_ROUTE]: landingRoute,
  [EVENTS_ROUTE]: eventsRoute,
  [SPRUNGBRETT_ROUTE]: sprungbrettRoute,
  [WOHNEN_ROUTE]: wohnenRoute,
  [EXTRAS_ROUTE]: extrasRoute,
  [DISCLAIMER_ROUTE]: disclaimerRoute,
  [SEARCH_ROUTE]: searchRoute,
  [POIS_ROUTE]: poisRoute,
  [CATEGORIES_ROUTE]: categoriesRoute
}

export const getRoute = (routeName: string): Route<*, *> => {
  const route = routes[routeName]
  if (!route) {
    throw new Error(`There is no route with the name ${routeName}. Did you forget to add it in the routes index?`)
  }
  return route
}

export const getLanguageChangePath = (routeName: string) => (params: GetLanguageChangePathParamsType) => {
  const getPath = getRoute(routeName).getLanguageChangePath
  if (!getPath) {
    throw new Error(`There is no getLanguageChangePath method for the route ${routeName}.`)
  }
  return getPath(params)
}
