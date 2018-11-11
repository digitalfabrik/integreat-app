// @flow

import categoriesRoute from './categories'
import eventsRoute from './events'
import { EXTRAS_ROUTE, extrasRoute, getExtrasPath, renderExtrasPage } from './extras'
import { DISCLAIMER_ROUTE, disclaimerRoute, getDisclaimerPath, renderDisclaimerPage } from './disclaimer'
import poisRoute from './pois'
import { getSprungbrettExtraPath, renderSprungbrettPage, SPRUNGBRETT_ROUTE, sprungbrettRoute } from './sprungbrett'
import { getWohnenExtraPath, renderWohnenPage, WOHNEN_ROUTE, wohnenRoute } from './wohnen'
import { getSearchPath, renderSearchPage, SEARCH_ROUTE, searchRoute } from './search'
import { MAIN_DISCLAIMER_ROUTE, mainDisclaimerRoute, renderMainDisclaimerPage } from './mainDisclaimer'
import { I18N_REDIRECT_ROUTE, i18nRedirectRoute, renderI18nPage } from './i18nRedirect'
import { LANDING_ROUTE, landingRoute, renderLandingPage } from './landing'
import type { Route as RouterRouteType } from 'redux-first-router'
import Route from './Route'

export const requiredPayloads = {
  [EXTRAS_ROUTE]: (payloads: AllPayloadsType) =>
    ({extras: payloads.extrasPayload, cities: payloads.citiesPayload}),
  [DISCLAIMER_ROUTE]: (payloads: AllPayloadsType) =>
    ({disclaimer: payloads.disclaimerPayload, cities: payloads.citiesPayload}),
  [SPRUNGBRETT_ROUTE]: (payloads: AllPayloadsType) => ({
    extras: payloads.extrasPayload, cities: payloads.citiesPayload, sprungbrettJobs: payloads.sprungbrettJobsPayload}),
  [WOHNEN_ROUTE]: (payloads: AllPayloadsType) =>
    ({extras: payloads.extrasPayload, cities: payloads.citiesPayload, offers: payloads.wohnenPayload}),
  [SEARCH_ROUTE]: (payloads: AllPayloadsType) =>
    ({categories: payloads.categoriesPayload, cities: payloads.citiesPayload}),
  [MAIN_DISCLAIMER_ROUTE]: () => ({}),
  [I18N_REDIRECT_ROUTE]: (payloads: AllPayloadsType) => ({cities: payloads.citiesPayload}),
  [LANDING_ROUTE]: (payloads: AllPayloadsType) => ({cities: payloads.citiesPayload})
}

// this maps all goToRoute actions to the right routes (except from the NOT_FOUND route)
// the order is important, routes declared first are served first, so i.e. if you put the mainDisclaimer route after
// the i18nRedirect route, "/disclaimer" also matches the i18nRedirect route
export const routesMap: {[string]: RouterRouteType} = {
  [MAIN_DISCLAIMER_ROUTE]: mainDisclaimerRoute,
  [I18N_REDIRECT_ROUTE]: i18nRedirectRoute,
  [LANDING_ROUTE]: landingRoute,
  [eventsRoute.name]: eventsRoute,
  [SPRUNGBRETT_ROUTE]: sprungbrettRoute,
  [WOHNEN_ROUTE]: wohnenRoute,
  [EXTRAS_ROUTE]: extrasRoute,
  [DISCLAIMER_ROUTE]: disclaimerRoute,
  [SEARCH_ROUTE]: searchRoute,
  [poisRoute.name]: poisRoute,
  [categoriesRoute.name]: categoriesRoute
}

const routes: {[string]: Route} = {
  [categoriesRoute.name]: categoriesRoute,
  [eventsRoute.name]: eventsRoute,
  [EXTRAS_ROUTE]: renderExtrasPage,
  [DISCLAIMER_ROUTE]: renderDisclaimerPage,
  [poisRoute.name]: poisRoute,
  [SPRUNGBRETT_ROUTE]: renderSprungbrettPage,
  [WOHNEN_ROUTE]: renderWohnenPage,
  [SEARCH_ROUTE]: renderSearchPage,
  [MAIN_DISCLAIMER_ROUTE]: renderMainDisclaimerPage,
  [I18N_REDIRECT_ROUTE]: renderI18nPage,
  [LANDING_ROUTE]: renderLandingPage
}

export default routes
