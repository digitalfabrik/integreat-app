import {
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
  TuNewsType
} from './'

type CityContentParamsType = {
  cityCode: string
  languageCode: string
  cityContentRoute: true
}
export type LandingRouteInformationType = {
  route: LandingRouteType
  languageCode: string
  cityContentRoute: false
}
export type JpalTrackingRouteInformationType = {
  route: JpalTrackingRouteType
  trackingCode: string | null
  cityContentRoute: false
}
export type CategoriesRouteInformationType = CityContentParamsType & {
  route: DashboardRouteType | CategoriesRouteType
  cityContentPath: string
}
export type NewsRouteInformationType = CityContentParamsType & {
  // Two levels of ids: news type and news id
  route: NewsRouteType
  newsType: LocalNewsType | TuNewsType
  newsId?: string
}
export type SimpleCityContentFeatureType = CityContentParamsType & {
  // Routes without customizable ids, e.g. '/augsburg/de/disclaimer/
  route: DisclaimerRouteType | OffersRouteType | SprungbrettOfferRouteType | SearchRouteType
}
export type EventsPoisRouteInformationType = CityContentParamsType & {
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
