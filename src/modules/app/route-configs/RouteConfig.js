// @flow

import type { Location, Route } from 'redux-first-router'
import {
  CityModel,
  Payload,
  ExtraModel,
  PoiModel,
  CategoriesMapModel,
  SprungbrettModel,
  WohnenOfferModel,
  PageModel,
  EventModel
} from '@integreat-app/integreat-api-client'
import type { TFunction } from 'react-i18next'

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

export interface RouteConfig<T, P> {
  name: string,
  route: Route,
  getRoutePath: T => string,
  getLanguageChangePath: GetLanguageChangePathParamsType => string | null,
  getPageTitle: GetPageTitleParamsType => string,
  getRequiredPayloads: AllPayloadsType => P
}
