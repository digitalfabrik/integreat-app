// @flow

import { CATEGORIES_ROUTE, categoriesRoute, getCategoriesLanguageChangePath, renderCategoriesPage } from './categories'
import { EVENTS_ROUTE, eventsRoute, getEventsLanguageChangePath, renderEventsPage } from './events'
import PoiModel from '../../endpoint/models/PoiModel'
import EventModel from '../../endpoint/models/EventModel'
import PageModel from '../../endpoint/models/PageModel'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import SprungbrettExtraPage from '../../../routes/sprungbrett/containers/SprungbrettExtraPage'
import Payload from '../../endpoint/Payload'
import CityModel from '../../endpoint/models/CityModel'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import ExtraModel from '../../endpoint/models/ExtraModel'
import { EXTRAS_ROUTE, extrasRoute, getExtrasPath, renderExtrasPage } from './extras'
import { DISCLAIMER_ROUTE, disclaimerRoute, getDisclaimerPath, renderDisclaimerPage } from './disclaimer'
import { getPoisPath, POIS_ROUTE, poisRoute, renderPoisPage } from './pois'
import { getSprungbrettExtraPath, renderSprungbrettPage, SPRUNGBRETT_ROUTE, sprungbrettRoute } from './sprungbrett'
import { getWohnenExtraPath, renderWohnenPage, WOHNEN_ROUTE, wohnenRoute } from './wohnen'
import { getSearchPath, renderSearchPage, SEARCH_ROUTE, searchRoute } from './search'
import { MAIN_DISCLAIMER_ROUTE, mainDisclaimerRoute, renderMainDisclaimerPage } from './mainDisclaimer'
import { I18N_REDIRECT_ROUTE, i18nRedirectRoute, renderI18nPage } from './i18nRedirect'
import { LANDING_ROUTE, landingRoute, renderLandingPage } from './landing'
import type { Route } from 'redux-first-router'

export type AllPayloadsType = {|
  citiesPayload: Payload<Array<CityModel>>,
  categoriesPayload: Payload<CategoriesMapModel>,
  poisPayload: Payload<Array<PoiModel>>,
  eventsPayload: Payload<Array<EventModel>>,
  extrasPayload: Payload<Array<ExtraModel>>,
  sprungbrettJobsPayload: Payload<Array<SprungbrettExtraPage>>,
  wohnenPayload: Payload<Array<WohnenOfferModel>>,
  disclaimerPayload: Payload<PageModel>
|}

export const requiredPayloads = {
  [CATEGORIES_ROUTE]: (payloads: AllPayloadsType) =>
    ({categories: payloads.categoriesPayload, cities: payloads.citiesPayload}),
  [EVENTS_ROUTE]: (payloads: AllPayloadsType) =>
    ({events: payloads.eventsPayload, cities: payloads.citiesPayload}),
  [EXTRAS_ROUTE]: (payloads: AllPayloadsType) =>
    ({extras: payloads.extrasPayload, cities: payloads.citiesPayload}),
  [DISCLAIMER_ROUTE]: (payloads: AllPayloadsType) =>
    ({disclaimer: payloads.disclaimerPayload, cities: payloads.citiesPayload}),
  [POIS_ROUTE]: (payloads: AllPayloadsType) =>
    ({pois: payloads.poisPayload, cities: payloads.citiesPayload}),
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

export const pages = {
  [CATEGORIES_ROUTE]: renderCategoriesPage,
  [EVENTS_ROUTE]: renderEventsPage,
  [EXTRAS_ROUTE]: renderExtrasPage,
  [DISCLAIMER_ROUTE]: renderDisclaimerPage,
  [POIS_ROUTE]: renderPoisPage,
  [SPRUNGBRETT_ROUTE]: renderSprungbrettPage,
  [WOHNEN_ROUTE]: renderWohnenPage,
  [SEARCH_ROUTE]: renderSearchPage,
  [MAIN_DISCLAIMER_ROUTE]: renderMainDisclaimerPage,
  [I18N_REDIRECT_ROUTE]: renderI18nPage,
  [LANDING_ROUTE]: renderLandingPage
}

export const getLanguageChangePath = {
  [CATEGORIES_ROUTE]: getCategoriesLanguageChangePath,
  [EVENTS_ROUTE]: getEventsLanguageChangePath,
  [EXTRAS_ROUTE]: getExtrasPath,
  [DISCLAIMER_ROUTE]: getDisclaimerPath,
  [POIS_ROUTE]: getPoisPath,
  [SPRUNGBRETT_ROUTE]: getSprungbrettExtraPath,
  [WOHNEN_ROUTE]: getWohnenExtraPath,
  [SEARCH_ROUTE]: getSearchPath
}

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
