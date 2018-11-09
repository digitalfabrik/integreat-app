// @flow

import { CATEGORIES_ROUTE, renderCategoriesPage } from './categories'
import { EVENTS_ROUTE, renderEventsPage } from './events'
import PoiModel from '../../endpoint/models/PoiModel'
import EventModel from '../../endpoint/models/EventModel'
import PageModel from '../../endpoint/models/PageModel'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import SprungbrettExtraPage from '../../../routes/sprungbrett/containers/SprungbrettExtraPage'
import Payload from '../../endpoint/Payload'
import CityModel from '../../endpoint/models/CityModel'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import ExtraModel from '../../endpoint/models/ExtraModel'
import { EXTRAS_ROUTE, renderExtrasPage } from './extras'
import { DISCLAIMER_ROUTE, renderDisclaimerPage } from './disclaimer'
import { POIS_ROUTE, renderPoisPage } from './pois'
import { renderSprungbrettPage, SPRUNGBRETT_ROUTE } from './sprungbrett'
import { renderWohnenPage, WOHNEN_ROUTE } from './wohnen'
import { renderSearchPage, SEARCH_ROUTE } from './search'
import { MAIN_DISCLAIMER_ROUTE, renderMainDisclaimerPage } from './mainDisclaimer'
import { I18N_REDIRECT_ROUTE, renderI18nPage } from './i18nRedirect'
import { LANDING_ROUTE, renderLandingPage } from './landing'

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
