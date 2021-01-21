// @flow

import type { Route } from 'redux-first-router'
import { RouteConfig } from './RouteConfig'
import CategoriesRouteConfig, { CATEGORIES_ROUTE } from './CategoriesRouteConfig'
import I18nRedirectRouteConfig, { I18N_REDIRECT_ROUTE } from './I18nRedirectRouteConfig'
import LandingRouteConfig, { LANDING_ROUTE } from './LandingRouteConfig'
import MainDisclaimerRouteConfig, { MAIN_DISCLAIMER_ROUTE } from './MainDisclaimerRouteConfig'
import EventsRouteConfig, { EVENTS_ROUTE } from './EventsRouteConfig'
import LocalNewsRouteConfig, { LOCAL_NEWS_ROUTE } from './LocalNewsRouteConfig'
import LocalNewsDetailsRouteConfig, { LOCAL_NEWS_DETAILS_ROUTE } from './LocalNewsDetailsRouteConfig'
import TunewsDetailsRouteConfig, { TUNEWS_DETAILS_ROUTE } from './TunewsDetailsRouteConfig'
import TunewsRouteConfig, { TUNEWS_ROUTE } from './TunewsRouteConfig'
import WohnenRouteConfig, { WOHNEN_ROUTE } from './WohnenRouteConfig'
import OffersRouteConfig, { OFFERS_ROUTE } from './OffersRouteConfig'
import SearchRouteConfig, { SEARCH_ROUTE } from './SearchRouteConfig'
import PoisRouteConfig, { POIS_ROUTE } from './PoisRouteConfig'
import DisclaimerRouteConfig, { DISCLAIMER_ROUTE } from './DisclaimerRouteConfig'
import SprungbrettRouteConfig, { SPRUNGBRETT_ROUTE } from './SprungbrettRouteConfig'
import NotFoundRouteConfig, { NOT_FOUND_ROUTE } from './NotFoundRouteConfig'

const routeConfigs: {[string]: RouteConfig<any, any>} = {
  [MAIN_DISCLAIMER_ROUTE]: new MainDisclaimerRouteConfig(),
  [I18N_REDIRECT_ROUTE]: new I18nRedirectRouteConfig(),
  [LANDING_ROUTE]: new LandingRouteConfig(),
  [EVENTS_ROUTE]: new EventsRouteConfig(),
  [LOCAL_NEWS_ROUTE]: new LocalNewsRouteConfig(),
  [LOCAL_NEWS_DETAILS_ROUTE]: new LocalNewsDetailsRouteConfig(),
  [TUNEWS_DETAILS_ROUTE]: new TunewsDetailsRouteConfig(),
  [TUNEWS_ROUTE]: new TunewsRouteConfig(),
  [SPRUNGBRETT_ROUTE]: new SprungbrettRouteConfig(),
  [WOHNEN_ROUTE]: new WohnenRouteConfig(),
  [OFFERS_ROUTE]: new OffersRouteConfig(),
  [DISCLAIMER_ROUTE]: new DisclaimerRouteConfig(),
  [SEARCH_ROUTE]: new SearchRouteConfig(),
  [POIS_ROUTE]: new PoisRouteConfig(),
  [CATEGORIES_ROUTE]: new CategoriesRouteConfig(),
  [NOT_FOUND_ROUTE]: new NotFoundRouteConfig()
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
  [LOCAL_NEWS_ROUTE]: new LocalNewsRouteConfig().route,
  [LOCAL_NEWS_DETAILS_ROUTE]: new LocalNewsDetailsRouteConfig().route,
  [TUNEWS_DETAILS_ROUTE]: new TunewsDetailsRouteConfig().route,
  [TUNEWS_ROUTE]: new TunewsRouteConfig().route,
  [SPRUNGBRETT_ROUTE]: new SprungbrettRouteConfig().route,
  [WOHNEN_ROUTE]: new WohnenRouteConfig().route,
  [OFFERS_ROUTE]: new OffersRouteConfig().route,
  [DISCLAIMER_ROUTE]: new DisclaimerRouteConfig().route,
  [SEARCH_ROUTE]: new SearchRouteConfig().route,
  [POIS_ROUTE]: new PoisRouteConfig().route,
  [CATEGORIES_ROUTE]: new CategoriesRouteConfig().route
}
