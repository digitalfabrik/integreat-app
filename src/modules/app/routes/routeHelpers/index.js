// @flow

import { CATEGORIES_ROUTE } from '../categories'
import { EVENTS_ROUTE } from '../events'
import { EXTRAS_ROUTE } from '../extras'
import { DISCLAIMER_ROUTE } from '../disclaimer'
import { POIS_ROUTE } from '../pois'
import { SPRUNGBRETT_ROUTE } from '../sprungbrett'
import { WOHNEN_ROUTE } from '../wohnen'
import { SEARCH_ROUTE } from '../search'
import { MAIN_DISCLAIMER_ROUTE } from '../mainDisclaimer'
import { I18N_REDIRECT_ROUTE } from '../i18nRedirect'
import { LANDING_ROUTE } from '../landing'
import type { Route } from 'redux-first-router'
import RouteHelper from './RouteHelper'
import type { GetLanguageChangePathParamsType } from '../types'
import categoriesRouteHelper from './categories'
import i18nRedirectRouteHelper from './i18nRedirect'
import landingRouteHelper from './landing'
import mainDisclaimerRouteHelper from './mainDisclaimer'
import eventsRouteHelper from './events'
import wohnenRouteHelper from './wohnen'
import extrasRouteHelper from './extras'
import searchRouteHelper from './search'
import poisRouteHelper from './pois'
import disclaimerRouteHelper from './disclaimer'
import sprungbrettRouteHelper from './sprungbrett'

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
