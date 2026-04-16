import {
  CategoriesRouteType,
  CityNotCooperatingRouteType,
  ConsentRouteType,
  ImprintRouteType,
  EventsRouteType,
  LandingRouteType,
  LicensesRouteType,
  LocalNewsType,
  MainImprintRouteType,
  NewsRouteType,
  PoisRouteType,
  SearchRouteType,
  TuNewsType,
} from '.'

type ParamsType = {
  cityCode: string
  languageCode: string
  chat?: boolean
}

export type LandingRouteInformationType = {
  route: LandingRouteType
  languageCode: string
}

export type LicensesInformationType = {
  route: LicensesRouteType
}

export type MainImprintRouteInformationType = {
  route: MainImprintRouteType
}

export type ConsentInformationType = {
  route: ConsentRouteType
}

export type CityNotCooperatingInformationType = {
  route: CityNotCooperatingRouteType
  languageCode: string
}

export type CategoriesRouteInformationType = ParamsType & {
  route: CategoriesRouteType
  cityContentPath: string
}

export type NewsRouteInformationType = ParamsType & {
  // Two levels of ids: news type and news id
  route: NewsRouteType
  newsType: LocalNewsType | TuNewsType
  newsId?: number
}

export type SimpleCityContentFeatureType = ParamsType & {
  // Routes without customizable ids, e.g. '/augsburg/de/imprint/'
  route: ImprintRouteType
}

export type EventsRouteInformationType = ParamsType & {
  // Routes with customizable ids, e.g. '/augsburg/de/events/1234/'
  route: EventsRouteType
  slug?: string
}

export type PoisRouteInformationType = ParamsType & {
  // Route with customizable ids and search params, e.g. '/augsburg/de/pois/1234?multipoi=2'
  route: PoisRouteType
  slug?: string
  multipoi?: number
  poiCategoryId?: number
  zoom?: number
}

export type SearchRouteInformationType = ParamsType & {
  // Route with query, e.g. '/augsburg/de/search?query=zeugnis'
  route: SearchRouteType
  searchText?: string | null
}

export type NonNullableRouteInformationType =
  | MainImprintRouteInformationType
  | LandingRouteInformationType
  | CityNotCooperatingInformationType
  | CategoriesRouteInformationType
  | NewsRouteInformationType
  | SimpleCityContentFeatureType
  | EventsRouteInformationType
  | PoisRouteInformationType
  | LicensesInformationType
  | SearchRouteInformationType
  | ConsentInformationType

export type RouteInformationType = NonNullableRouteInformationType | null
