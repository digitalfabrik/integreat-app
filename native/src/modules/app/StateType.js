// @flow

import {
  CategoriesMapModel,
  CategoryModel,
  CityModel,
  EventModel,
  LanguageModel,
  LocalNewsModel,
  PoiModel,
  TunewsModel
} from 'api-client'
import Moment from 'moment'
import type { ErrorCodeType } from '../error/ErrorCodes'
import ErrorCodes from '../error/ErrorCodes'
import { config } from 'translations'
import type { NewsType } from 'api-client/src/routes'

export type PathType = string

export type CategoryRouteConfigType = {|
  +path: string,
  +depth: number,
  +language: string,
  +city: string
|}

export type CategoryRouteStateType = {|
  +routeType: 'category',
  +status: 'ready',
  ...CategoryRouteConfigType,
  +allAvailableLanguages: $ReadOnlyMap<string, string>, // including the current content language
  +models: $ReadOnly<{ [path: PathType]: CategoryModel }>, /* Models could be stored outside of CategoryRouteStateType
                                                              (e.g. CategoriesStateType) to save memory
                                                              in the state. This would be an optimization! */
  +children: $ReadOnly<{ [path: PathType]: $ReadOnlyArray<PathType> }>
|} | {|
  +routeType: 'category',
  +status: 'languageNotAvailable',
  +depth: number,
  +city: string,
  +language: string,
  +allAvailableLanguages: $ReadOnlyMap<string, string>
|} | {|
  +routeType: 'category',
  +status: 'loading',
  ...CategoryRouteConfigType,
  +allAvailableLanguages?: $ReadOnlyMap<string, string>,
  +models?: $ReadOnly<{ [path: PathType]: CategoryModel }>,
  +children?: $ReadOnly<{ [path: PathType]: $ReadOnlyArray<PathType> }>
|} | {|
  +routeType: 'category',
  +status: 'error',
  ...CategoryRouteConfigType,
  +message: string,
  +code: ErrorCodeType
|}

export type PoiRouteConfigType = {|
  +path: ?string, // path is null for the poi-lists route
  +language: string,
  +city: string
|}

export type PoiRouteStateType = {|
  +routeType: 'poi',
  +status: 'ready',
  ...PoiRouteConfigType,
  +models: $ReadOnlyArray<PoiModel>,
  +allAvailableLanguages: $ReadOnlyMap<string, ?string> // including the current content language
|} | {|
  +routeType: 'poi',
  +status: 'languageNotAvailable',
  ...PoiRouteConfigType,
  +allAvailableLanguages: $ReadOnlyMap<string, ?string>
|} | {|
  +routeType: 'poi',
  +status: 'loading',
  ...PoiRouteConfigType
|} | {|
  +routeType: 'poi',
  +status: 'error',
  ...PoiRouteConfigType,
  +code: ErrorCodeType,
  +message: ?string
|}

export type EventRouteConfigType = {|
  +path: ?string, // path is null for the event-lists route
  +language: string,
  +city: string
|}

export type EventRouteStateType = {|
  +routeType: 'event',
  +status: 'ready',
  ...EventRouteConfigType,
  +models: $ReadOnlyArray<EventModel>,
  +allAvailableLanguages: $ReadOnlyMap<string, ?string> // including the current content language
|} | {|
  +routeType: 'event',
  +status: 'languageNotAvailable',
  ...EventRouteConfigType,
  +allAvailableLanguages: $ReadOnlyMap<string, ?string>
|} | {|
  +routeType: 'event',
  +status: 'loading',
  ...EventRouteConfigType,
  +models?: $ReadOnlyArray<EventModel>,
  +allAvailableLanguages?: $ReadOnlyMap<string, ?string>
|} | {|
  +routeType: 'event',
  +status: 'error',
  ...EventRouteConfigType,
  +code: ErrorCodeType,
  +message: ?string
|}

export type NewsRouteConfigType = {|
  +newsId: ?string, // Path is null for the news list
  +language: string,
  +city: string,
  +type: NewsType
|}

export type NewsModelsType = $ReadOnlyArray<LocalNewsModel | TunewsModel>
export type NewsRouteStateType = {|
  +routeType: 'news',
  +status: 'ready',
  +models: NewsModelsType,
  +hasMoreNews: boolean,
  +page: number,
  ...NewsRouteConfigType,
  +allAvailableLanguages: $ReadOnlyMap<string, ?string>
|} | {|
  +routeType: 'news',
  +status: 'languageNotAvailable',
  ...NewsRouteConfigType,
  +allAvailableLanguages: $ReadOnlyMap<string, ?string>
|} | {|
  +routeType: 'news',
  +status: 'loading',
  ...NewsRouteConfigType
|} | {|
  +routeType: 'news',
  +status: 'loadingMore',
  +models: NewsModelsType,
  ...NewsRouteConfigType
|} | {|
  +routeType: 'news',
  +status: 'error',
  ...NewsRouteConfigType,
  +code: ErrorCodeType,
  +message: ?string
|}

export type PageResourceCacheEntryStateType = {|
  +filePath: string,
  +lastUpdate: Moment,
  +hash: string
|}

export type PageResourceCacheStateType = $ReadOnly<{
  [url: string]: PageResourceCacheEntryStateType
}>

export type LanguageResourceCacheStateType = $ReadOnly<{
  [path: string]: PageResourceCacheStateType
}>

export type ResourceCacheStateType = {|
  +status: 'error',
  +code: ErrorCodeType,
  +message: ?string
|} | {|
  +status: 'ready',
  +progress: number,
  +value: LanguageResourceCacheStateType
|}

export type CityResourceCacheStateType = $ReadOnly<{
  [language: string]: LanguageResourceCacheStateType
}>

export type CitiesStateType = {|
  +status: 'ready',
  +models: $ReadOnlyArray<CityModel>
|} | {|
  +status: 'loading'
|} | {|
  +status: 'error',
  +code: ErrorCodeType,
  +message: string
|}

export const defaultCitiesState: CitiesStateType = {
  status: 'error',
  code: ErrorCodes.UnknownError,
  message: 'Cities not yet initialized'
}

export type LanguagesStateType = {|
  +status: 'ready',
  +models: $ReadOnlyArray<LanguageModel>
|} | {|
  +status: 'loading'
|} | {|
  +status: 'error',
  +code: ErrorCodeType,
  +message: string
|}

export const defaultContentLanguageState = config.defaultFallback

export type SearchRouteType = {|
  +categoriesMap: CategoriesMapModel
|}

export type RouteStateType = CategoryRouteStateType
  | NewsRouteStateType
  | EventRouteStateType
  | PoiRouteStateType

export type RouteMappingType = $ReadOnly<{
  [key: string]: RouteStateType
}>

export type CityContentStateType = {|
  +city: string,
  +switchingLanguage: boolean,
  +languages: LanguagesStateType,
  +routeMapping: RouteMappingType,
  +resourceCache: ResourceCacheStateType,
  +searchRoute: SearchRouteType | null
|}

export const defaultCityContentState = null

export type StateType = {|
  +darkMode: boolean,
  +resourceCacheUrl: string | null,
  +cityContent: CityContentStateType | null,
  +contentLanguage: string,
  +cities: CitiesStateType
|}
