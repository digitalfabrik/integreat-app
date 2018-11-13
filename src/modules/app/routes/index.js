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
import i18nRedirect, { I18N_REDIRECT_ROUTE } from './i18nRedirect'
import landingRoute, { LANDING_ROUTE } from './landing'
import type { Route as RouterRouteType } from 'redux-first-router'
import Route from './Route'

// this maps all goToRoute actions to the right routes (except from the NOT_FOUND route)
// the order is important, routes declared first are served first, so i.e. if you put the mainDisclaimer route after
// the i18nRedirect route, "/disclaimer" also matches the i18nRedirect route
export const routesMap: {[string]: RouterRouteType} = {
  [MAIN_DISCLAIMER_ROUTE]: mainDisclaimerRoute.route,
  [I18N_REDIRECT_ROUTE]: i18nRedirect.route,
  [LANDING_ROUTE]: landingRoute.route,
  [EVENTS_ROUTE]: eventsRoute.route,
  [SPRUNGBRETT_ROUTE]: sprungbrettRoute.route,
  [WOHNEN_ROUTE]: wohnenRoute.route,
  [EXTRAS_ROUTE]: extrasRoute.route,
  [DISCLAIMER_ROUTE]: disclaimerRoute.route,
  [SEARCH_ROUTE]: searchRoute.route,
  [POIS_ROUTE]: poisRoute.route,
  [CATEGORIES_ROUTE]: categoriesRoute.route
}

const routes: {[string]: Route<any, any>} = {
  [CATEGORIES_ROUTE]: categoriesRoute,
  [EVENTS_ROUTE]: eventsRoute,
  [EXTRAS_ROUTE]: extrasRoute,
  [DISCLAIMER_ROUTE]: disclaimerRoute,
  [POIS_ROUTE]: poisRoute,
  [SPRUNGBRETT_ROUTE]: sprungbrettRoute,
  [WOHNEN_ROUTE]: wohnenRoute,
  [SEARCH_ROUTE]: searchRoute,
  [MAIN_DISCLAIMER_ROUTE]: mainDisclaimerRoute,
  [I18N_REDIRECT_ROUTE]: i18nRedirect,
  [LANDING_ROUTE]: landingRoute
}

export default routes
