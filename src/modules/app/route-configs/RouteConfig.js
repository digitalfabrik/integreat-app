// @flow

import type { LocationState, Route } from 'redux-first-router'
import {
  CityModel,
  Payload,
  ExtraModel,
  PoiModel,
  CategoriesMapModel,
  SprungbrettJobModel,
  WohnenOfferModel,
  PageModel,
  EventModel,
  LocalNewsModel,
  TunewsModel
} from '@integreat-app/integreat-api-client'
import type { TFunction } from 'react-i18next'

export type AllPayloadsType = {|
  citiesPayload: Payload<Array<CityModel>>,
  categoriesPayload: Payload<CategoriesMapModel>,
  poisPayload: Payload<Array<PoiModel>>,
  eventsPayload: Payload<Array<EventModel>>,
  localNewsPayload: Payload<Array<LocalNewsModel>>,
  localNewsElementPayload: Payload<LocalNewsModel>,
  tunewsPayload: Payload<Array<TunewsModel>>,
  tunewsElementPayload: Payload<TunewsModel>,
  extrasPayload: Payload<Array<ExtraModel>>,
  sprungbrettJobsPayload: Payload<Array<SprungbrettJobModel>>,
  wohnenPayload: Payload<Array<WohnenOfferModel>>,
  disclaimerPayload: Payload<PageModel>
|}

export type FeedbackTargetInformationType = {| path?: string, title?: string, alias?: string |} | null

export interface RouteConfig<T, P> {
  name: string,
  route: Route,
  isLocationLayoutRoute: boolean,
  requiresHeader: boolean,
  requiresFooter: boolean,
  getRoutePath: T => string,
  getLanguageChangePath: {|location: LocationState, payloads: P, language: string|} => string | null,
  getPageTitle: {|t: TFunction, cityName: ?string, location: LocationState, payloads: P|} => string | null,
  getRequiredPayloads: AllPayloadsType => P,
  getMetaDescription: (t: TFunction) => string | null,
  getFeedbackTargetInformation: {|location: LocationState, payloads: P|} => FeedbackTargetInformationType
}
