// @flow

import type { Location, Route } from 'redux-first-router'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import EventModel from '../../endpoint/models/EventModel'
import PoiModel from '../../endpoint/models/PoiModel'
import type { TFunction } from 'react-i18next'
import CityModel from '../../endpoint/models/CityModel'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import PageModel from '../../endpoint/models/PageModel'
import Payload from '../../endpoint/Payload'
import ExtraModel from '../../endpoint/models/ExtraModel'
import SprungbrettModel from '../../endpoint/models/SprungbrettJobModel'

export type AllPayloadsType = {|
  citiesPayload: Payload<Array<CityModel>>,
  categoriesPayload: Payload<CategoriesMapModel>,
  poisPayload: Payload<Array<PoiModel>>,
  eventsPayload: Payload<Array<EventModel>>,
  extrasPayload: Payload<Array<ExtraModel>>,
  sprungbrettJobsPayload: Payload<Array<SprungbrettModel>>,
  wohnenPayload: Payload<Array<WohnenOfferModel>>,
  disclaimerPayload: Payload<PageModel>
|}

export type GetLanguageChangePathParamsType = {|location: Location, events: ?Array<EventModel>,
  categories: ?CategoriesMapModel, pois: ?Array<PoiModel>, language: string|}

export type GetPageTitleParamsType = {|t: TFunction, cityName: string, pathname: string, events: ?Array<EventModel>,
  categories: ?CategoriesMapModel, pois: ?Array<PoiModel>, extras: ?Array<ExtraModel>, offers: ?Array<WohnenOfferModel>,
  offerHash: ?string
|}

export interface RouteConfigInterface<T, P> {
  name: string,
  route: Route,
  getRoutePath: T => string,
  getLanguageChangePath: GetLanguageChangePathParamsType => string | null,
  getPageTitle: GetPageTitleParamsType => string,
  getRequiredPayloads: AllPayloadsType => P
}
