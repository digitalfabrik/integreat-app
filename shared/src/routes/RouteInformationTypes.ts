import {
  CategoriesRouteType,
  SuggestToRegionRouteType,
  ConsentRouteType,
  ImprintRouteType,
  EventsRouteType,
  RegionsRouteType,
  LicensesRouteType,
  LocalNewsType,
  MainImprintRouteType,
  NewsRouteType,
  PlacesRouteType,
  SearchRouteType,
  TuNewsType,
} from './index.ts'

type ParamsType = {
  regionCode: string
  languageCode: string
  chat?: boolean
  chatId?: string
  theme?: string
}

export type RegionsRouteInformationType = {
  route: RegionsRouteType
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

export type SuggestToRegionInformationType = {
  route: SuggestToRegionRouteType
  languageCode: string
}

export type CategoriesRouteInformationType = ParamsType & {
  route: CategoriesRouteType
  regionContentPath: string
}

export type NewsRouteInformationType = ParamsType & {
  // Two levels of ids: news type and news id
  route: NewsRouteType
  newsType: LocalNewsType | TuNewsType
  newsId?: number
}

export type SimpleRegionContentFeatureType = ParamsType & {
  // Routes without customizable ids, e.g. '/augsburg/de/imprint/'
  route: ImprintRouteType
}

export type EventsRouteInformationType = ParamsType & {
  // Routes with customizable ids, e.g. '/augsburg/de/events/1234/'
  route: EventsRouteType
  slug?: string
}

export type PlacesRouteInformationType = ParamsType & {
  // Route with customizable ids and search params, e.g. '/augsburg/de/places/1234?multiplace=2'
  route: PlacesRouteType
  slug?: string
  multiPlace?: number
  placeCategoryId?: number
  zoom?: number
}

export type SearchRouteInformationType = ParamsType & {
  // Route with query, e.g. '/augsburg/de/search?query=zeugnis'
  route: SearchRouteType
  searchText?: string | null
}

export type NonNullableRouteInformationType =
  | MainImprintRouteInformationType
  | RegionsRouteInformationType
  | SuggestToRegionInformationType
  | CategoriesRouteInformationType
  | NewsRouteInformationType
  | SimpleRegionContentFeatureType
  | EventsRouteInformationType
  | PlacesRouteInformationType
  | LicensesInformationType
  | SearchRouteInformationType
  | ConsentInformationType

export type RouteInformationType = NonNullableRouteInformationType | null
