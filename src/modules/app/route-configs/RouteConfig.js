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

export type FeedbackTargetInformationType = {|id?: number, title?: string, alias?: string|} | null

export interface RouteConfig<T, P> {
  name: string,
  route: Route,
  isLocationLayoutRoute: boolean,
  requiresHeader: boolean,
  requiresFooter: boolean,
  getRoutePath: T => string,
  getLanguageChangePath: {|location: Location, payloads: P, language: string|} => string | null,
  getPageTitle: {|t: TFunction, cityName: ?string, location: Location, payloads: P|} => string | null,
  getRequiredPayloads: AllPayloadsType => P,
  getMetaDescription: (t: TFunction) => string | null,
  getFeedbackTargetInformation: {|location: Location, payloads: P|} => FeedbackTargetInformationType
}
