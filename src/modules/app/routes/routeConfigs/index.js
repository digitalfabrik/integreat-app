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
import RouteConfig from './RouteConfig'
import type { GetLanguageChangePathParamsType } from '../types'
import categoriesRouteConfig from './categories'
import i18nRedirectRouteConfig from './i18nRedirect'
import landingRouteConfig from './landing'
import mainDisclaimerRouteConfig from './mainDisclaimer'
import eventsRouteConfig from './events'
import wohnenRouteConfig from './wohnen'
import extrasRouteConfig from './extras'
import searchRouteConfig from './search'
import poisRouteConfig from './pois'
import disclaimerRouteConfig from './disclaimer'
import sprungbrettRouteConfig from './sprungbrett'

const routeConfigs: Array<RouteConfig<any>> = [
  mainDisclaimerRouteConfig,
  i18nRedirectRouteConfig,
  landingRouteConfig,
  eventsRouteConfig,
  sprungbrettRouteConfig,
  wohnenRouteConfig,
  extrasRouteConfig,
  disclaimerRouteConfig,
  searchRouteConfig,
  poisRouteConfig,
  categoriesRouteConfig
]

export const getRouteConfig = (routeName: string): Route<*> => {
  const routeConfig = routeConfigs.find(config => config.name === routeName)
  if (!routeConfig) {
    throw new Error(
      `There is no route config with the name ${routeName}. Did you forget to add it in the routes index?`)
  }
  return routeConfig
}

export const getLanguageChangePath = (routeName: string) => (params: GetLanguageChangePathParamsType) => {
  const getPath = getRouteConfig(routeName).getLanguageChangePath
  if (!getPath) {
    return null
  }
  return getPath(params)
}
