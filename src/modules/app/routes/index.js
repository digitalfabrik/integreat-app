// @flow

import categoriesRoute, { CATEGORIES_ROUTE } from './categories'
import eventsRoute, { EVENTS_ROUTE } from './events'
import extrasRoute, { EXTRAS_ROUTE } from './extras'
import disclaimerRoute, { DISCLAIMER_ROUTE } from './disclaimer'
import poisRoute, { POIS_ROUTE } from './pois'
import sprungbrettRoute, { SPRUNGBRETT_ROUTE } from './sprungbrett'
import wohnenRoute, { WOHNEN_ROUTE } from './wohnen'
import searchRoute, { SEARCH_ROUTE } from './search'
import mainDisclaimerRoute, { MAIN_DISCLAIMER_ROUTE } from './mainDisclaimer'
import i18nRedirectRoute, { I18N_REDIRECT_ROUTE } from './i18nRedirect'
import landingRoute, { LANDING_ROUTE } from './landing'
import type { Route } from 'redux-first-router'
import RouteHelper from './routeHelpers/RouteHelper'
import type { GetLanguageChangePathParamsType } from './types'
import categoriesRouteHelper from './routeHelpers/categories'
import i18nRedirectRouteHelper from './routeHelpers/i18nRedirect'
import landingRouteHelper from './routeHelpers/landing'
import mainDisclaimerRouteHelper from './routeHelpers/mainDisclaimer'
import eventsRouteHelper from './routeHelpers/events'
import wohnenRouteHelper from './routeHelpers/wohnen'
import extrasRouteHelper from './routeHelpers/extras'
import searchRouteHelper from './routeHelpers/search'
import poisRouteHelper from './routeHelpers/pois'
import disclaimerRouteHelper from './routeHelpers/disclaimer'
import sprungbrettRouteHelper from './routeHelpers/sprungbrett'
// this maps all goToRoute actions to the right routes (except from the NOT_FOUND route)
// the order is important, routes declared first are served first, so i.e. if you put the mainDisclaimer route after
// the i18nRedirect route, "/disclaimer" also matches the i18nRedirect route
export const routesMap: {[string]: Route} = {
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

const routeHelpers: {[string]: RouteHelper<any>} = {
  [MAIN_DISCLAIMER_ROUTE]: mainDisclaimerRouteHelper,
  [I18N_REDIRECT_ROUTE]: i18nRedirectRouteHelper,
  [LANDING_ROUTE]: landingRouteHelper,
  [EVENTS_ROUTE]: eventsRouteHelper,
  [SPRUNGBRETT_ROUTE]: sprungbrettRouteHelper,
  [WOHNEN_ROUTE]: wohnenRouteHelper,
  [EXTRAS_ROUTE]: extrasRouteHelper,
  [DISCLAIMER_ROUTE]: disclaimerRouteHelper,
  [SEARCH_ROUTE]: searchRouteHelper,
  [POIS_ROUTE]: poisRouteHelper,
  [CATEGORIES_ROUTE]: categoriesRouteHelper
}

export const getRouteHelper = (routeName: string): Route<*, *> => {
  const routeHelper = routeHelpers[routeName]
  if (!routeHelper) {
    throw new Error(`There is no routeHelper with the name ${routeName}. Did you forget to add it in the routes index?`)
  }
  return routeHelper
}

export const getLanguageChangePath = (routeName: string) => (params: GetLanguageChangePathParamsType) => {
  const getPath = getRouteHelper(routeName).getLanguageChangePath
  if (!getPath) {
    return null
  }
  return getPath(params)
}
