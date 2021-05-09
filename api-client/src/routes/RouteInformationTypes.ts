import type {
  CategoriesRouteType,
  DashboardRouteType,
  DisclaimerRouteType,
  EventsRouteType,
  JpalTrackingRouteType,
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
type ParamsType = {
  cityCode: string
  languageCode: string
}
export type LandingRouteInformationType = {
  route: LandingRouteType
  languageCode: string
}
export type JpalTrackingRouteInformationType = {
  route: JpalTrackingRouteType
  trackingCode: string | null
}
export type CategoriesRouteInformationType = ParamsType & {
  route: DashboardRouteType | CategoriesRouteType
  cityContentPath: string
}
export type NewsRouteInformationType = ParamsType & {
  // Two levels of ids: news type and news id
  route: NewsRouteType
  newsType: LocalNewsType | TuNewsType
  newsId?: string
}
export type SimpleCityContentFeatureType = ParamsType & {
  // Routes without customizable ids, e.g. '/augsburg/de/disclaimer/
  route: DisclaimerRouteType | OffersRouteType | SprungbrettOfferRouteType | WohnenOfferRouteType | SearchRouteType
}
export type EventsPoisRouteInformationType = ParamsType & {
  // Routes with customizable ids, e.g. '/augsburg/de/pois/1234/
  route: EventsRouteType | PoisRouteType
  cityContentPath?: string
}
export type NonNullableRouteInformationType =
  | LandingRouteInformationType
  | JpalTrackingRouteInformationType
  | CategoriesRouteInformationType
  | NewsRouteInformationType
  | SimpleCityContentFeatureType
  | EventsPoisRouteInformationType
export type RouteInformationType = NonNullableRouteInformationType | null