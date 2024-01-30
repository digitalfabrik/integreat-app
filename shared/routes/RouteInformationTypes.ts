import {
  CategoriesRouteType,
  CityNotCooperatingRouteType,
  ConsentRouteType,
  DisclaimerRouteType,
  EventsRouteType,
  JpalTrackingRouteType,
  LandingRouteType,
  LicensesRouteType,
  LocalNewsType,
  NewsRouteType,
  OffersRouteType,
  PoisRouteType,
  SearchRouteType,
  SprungbrettOfferRouteType,
  TuNewsType,
} from '.'

type ParamsType = {
  cityCode: string
  languageCode: string
}

export type LandingRouteInformationType = {
  route: LandingRouteType
  languageCode: string
}

export type LicensesInformationType = {
  route: LicensesRouteType
}

export type ConsentInformationType = {
  route: ConsentRouteType
}

export type CityNotCooperatingInformationType = {
  route: CityNotCooperatingRouteType
  languageCode: string
}

export type JpalTrackingRouteInformationType = {
  route: JpalTrackingRouteType
  trackingCode: string | null
}

export type CategoriesRouteInformationType = ParamsType & {
  route: CategoriesRouteType
  cityContentPath: string
}

export type NewsRouteInformationType = ParamsType & {
  // Two levels of ids: news type and news id
  route: NewsRouteType
  newsType: LocalNewsType | TuNewsType
  newsId?: string
}

export type SimpleCityContentFeatureType = ParamsType & {
  // Routes without customizable ids, e.g. '/augsburg/de/disclaimer/'
  route: DisclaimerRouteType | OffersRouteType | SprungbrettOfferRouteType
}

export type EventsRouteInformationType = ParamsType & {
  // Routes with customizable ids, e.g. '/augsburg/de/events/1234/'
  route: EventsRouteType
  slug?: string
}

export type PoisRouteInformationType = ParamsType & {
  // Route with customizable ids and query, e.g. '/augsburg/de/pois/1234?multipoi=2'
  route: PoisRouteType
  slug?: string
  multipoi?: string | null
}

export type SearchRouteInformationType = ParamsType & {
  // Route with query, e.g. '/augsburg/de/search?query=zeugnis'
  route: SearchRouteType
  searchText?: string | null
}

export type NonNullableRouteInformationType =
  | LandingRouteInformationType
  | CityNotCooperatingInformationType
  | JpalTrackingRouteInformationType
  | CategoriesRouteInformationType
  | NewsRouteInformationType
  | SimpleCityContentFeatureType
  | EventsRouteInformationType
  | PoisRouteInformationType
  | LicensesInformationType
  | SearchRouteInformationType
  | ConsentInformationType

export type RouteInformationType = NonNullableRouteInformationType | null
