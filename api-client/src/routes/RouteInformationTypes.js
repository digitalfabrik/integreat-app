// @flow

import type {
  CategoriesRouteType,
  DashboardRouteType,
  DisclaimerRouteType,
  EventsRouteType,
  LandingRouteType,
  LocalNewsType,
  NewsRouteType,
  OffersRouteType,
  PoisRouteType,
  SearchRouteType,
  SprungbrettOfferRouteType,
  TuNewsType,
  WohnenOfferRouteType
} from './'

type ParamsType = {|
  cityCode: string,
  languageCode: string
|}

export type LandingRouteInformationType = {|
  route: LandingRouteType,
  languageCode: string
|}

export type CategoriesRouteInformationType = {|
  route: DashboardRouteType | CategoriesRouteType,
  cityContentPath: string,
  ...ParamsType
|}
export type NewsRouteInformationType = {|
  // Two levels of ids: news type and news id
  route: NewsRouteType,
  newsType: LocalNewsType | TuNewsType,
  newsId?: string,
  ...ParamsType
|}
export type SimpleCityContentFeatureType = {|
  // Routes without customizable ids, e.g. '/augsburg/de/disclaimer/
  route: DisclaimerRouteType | OffersRouteType | SprungbrettOfferRouteType | WohnenOfferRouteType | SearchRouteType,
  ...ParamsType
|}
export type EventsPoisRouteInformationType = {|
  // Routes with customizable ids, e.g. '/augsburg/de/pois/1234/
  route: EventsRouteType | PoisRouteType,
  cityContentPath?: string,
  ...ParamsType
|}

export type RouteInformationType =
  | LandingRouteInformationType
  | CategoriesRouteInformationType
  | NewsRouteInformationType
  | SimpleCityContentFeatureType
  | EventsPoisRouteInformationType
  | null
