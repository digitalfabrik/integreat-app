// @flow

import categoriesRoute from './categories'
import eventsRoute from './events'
import extrasRoute from './extras'
import disclaimerRoute from './disclaimer'
import poisRoute from './pois'
import sprungbrettRoute from './sprungbrett'
import wohnenRoute from './wohnen'
import searchRoute from './search'
import mainDisclaimerRoute from './mainDisclaimer'
import i18nRedirectRoute from './i18nRedirect'
import landingRoute from './landing'
import type { Route as RouterRouteType } from 'redux-first-router'
import Route from './Route'

// this maps all goToRoute actions to the right routes (except from the NOT_FOUND route)
// the order is important, routes declared first are served first, so i.e. if you put the mainDisclaimer route after
// the i18nRedirect route, "/disclaimer" also matches the i18nRedirect route
export const routesMap: {[string]: RouterRouteType} = {
  [mainDisclaimerRoute.name]: mainDisclaimerRoute.route,
  [i18nRedirectRoute.name]: i18nRedirectRoute.route,
  [landingRoute.name]: landingRoute.route,
  [eventsRoute.name]: eventsRoute.route,
  [sprungbrettRoute.name]: sprungbrettRoute.route,
  [wohnenRoute.name]: wohnenRoute.route,
  [extrasRoute.name]: extrasRoute.route,
  [disclaimerRoute.name]: disclaimerRoute.route,
  [searchRoute.name]: searchRoute.route,
  [poisRoute.name]: poisRoute.route,
  [categoriesRoute.name]: categoriesRoute.route
}

const routes: {[string]: Route<any, any>} = {
  [categoriesRoute.name]: categoriesRoute,
  [eventsRoute.name]: eventsRoute,
  [extrasRoute.name]: extrasRoute,
  [disclaimerRoute.name]: disclaimerRoute,
  [poisRoute.name]: poisRoute,
  [sprungbrettRoute.name]: sprungbrettRoute,
  [wohnenRoute.name]: wohnenRoute,
  [searchRoute.name]: searchRoute,
  [mainDisclaimerRoute.name]: mainDisclaimerRoute,
  [i18nRedirectRoute.name]: i18nRedirectRoute,
  [landingRoute.name]: landingRoute
}

export default routes
