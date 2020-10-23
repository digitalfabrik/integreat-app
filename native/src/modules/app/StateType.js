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
} from '@integreat-app/integreat-api-client'
import Moment from 'moment'
import { DEFAULT_LANGUAGE } from '../i18n/constants'
import type { ErrorCodeType } from '../error/ErrorCodes'
import ErrorCodes from '../error/ErrorCodes'

export type PathType = string

export type CategoryRouteConfigType = {|
  +path: string,
  +depth: number,
  +language: string,
  +city: string
|}

export type CategoryRouteStateType = {|
  +status: 'ready',
  ...CategoryRouteConfigType,
  +allAvailableLanguages: $ReadOnlyMap<string, string>, // including the current content language
  +models: $ReadOnly<{ [path: PathType]: CategoryModel }>, /* Models could be stored outside of CategoryRouteStateType
                                                              (e.g. CategoriesStateType) to save memory
                                                              in the state. This would be an optimization! */
  +children: $ReadOnly<{ [path: PathType]: $ReadOnlyArray<PathType> }>
|} | {|
  +status: 'languageNotAvailable',
  +depth: number,
  +city: string,
  +language: string,
  +allAvailableLanguages: $ReadOnlyMap<string, string>
|} | {|
  +status: 'loading',
  ...CategoryRouteConfigType,
  +allAvailableLanguages: ?$ReadOnlyMap<string, string>,
  +models: ?$ReadOnly<{ [path: PathType]: CategoryModel }>,
  +children: ?$ReadOnly<{ [path: PathType]: $ReadOnlyArray<PathType> }>
|} | {|
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

// eslint-disable-next-line flowtype/type-id-match
type LanguageKey = string
// eslint-disable-next-line flowtype/type-id-match
type Path = ?string // Path can be falsy if the current displayed view is a list of events or POIs
type AllAvailableLanguagesType = $ReadOnlyMap<LanguageKey, Path>
export type PoiRouteStateType = {|
  +status: 'ready',
  ...PoiRouteConfigType,
  +models: $ReadOnlyArray<PoiModel>,
  +allAvailableLanguages: AllAvailableLanguagesType // including the current content language
|} | {|
  +status: 'languageNotAvailable',
  +language: string,
  +city: string,
  +allAvailableLanguages: $ReadOnlyMap<string, ?string>
|} | {|
  +status: 'loading',
  ...PoiRouteConfigType
|} | {|
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
  +status: 'ready',
  ...EventRouteConfigType,
  +models: $ReadOnlyArray<EventModel>,
  +allAvailableLanguages: $ReadOnlyMap<string, ?string> // including the current content language
|} | {|
  +status: 'languageNotAvailable',
  +language: string,
  +city: string,
  +allAvailableLanguages: $ReadOnlyMap<string, ?string>
|} | {|
  +status: 'loading',
  ...EventRouteConfigType,
  +models: ?$ReadOnlyArray<EventModel>,
  +allAvailableLanguages: ?$ReadOnlyMap<string, ?string> // including the current content language
|} | {|
  +status: 'error',
  ...EventRouteConfigType,
  +code: ErrorCodeType,
  +message: ?string
|}

export type TunewsType = 'tunews'
export type LocalNewsType = 'local'
export type NewsType = TunewsType | LocalNewsType

export type NewsRouteConfigType = {|
  +newsId: ?string, // Path is null for the news list
  +language: string,
  +city: string,
  +type: NewsType // For checking whether type is local or tunews
|}

export type NewsModelsType = $ReadOnlyArray<LocalNewsModel | TunewsModel>
export type NewsRouteStateType = {|
  +status: 'ready',
  +models: NewsModelsType,
  +hasMoreNews: boolean,
  +page: number,
  ...NewsRouteConfigType,
  +allAvailableLanguages: $ReadOnlyMap<string, ?string>
  |} | {|
  +status: 'languageNotAvailable',
  ...NewsRouteConfigType,
  +allAvailableLanguages: $ReadOnlyMap<string, ?string>
  |} | {|
  +status: 'loading',
  ...NewsRouteConfigType
  |} | {|
    +status: 'loadingMore',
    +models: NewsModelsType,
    ...NewsRouteConfigType
  |} | {|
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
  +value: LanguageResourceCacheStateType
|}

export type CityResourceCacheStateType = $ReadOnly<{
  [language: string]: LanguageResourceCacheStateType
}>

export type CategoriesRouteMappingType = $ReadOnly<{
  [key: string]: CategoryRouteStateType
}>

export type PoisRouteMappingType = $ReadOnly<{
  [key: string]: PoiRouteStateType
}>

export type NewsRouteMappingType = $ReadOnly<{
  [key: string]: NewsRouteStateType
}>

export type EventsRouteMappingType = $ReadOnly<{
  [key: string]: EventRouteStateType
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

export const defaultContentLanguageState = DEFAULT_LANGUAGE

export type SearchRouteType = {|
  +categoriesMap: CategoriesMapModel
|}

export type CityContentStateType = {|
  +city: string,
  +switchingLanguage: boolean,
  +languages: LanguagesStateType,
  +categoriesRouteMapping: CategoriesRouteMappingType,
  +eventsRouteMapping: EventsRouteMappingType,
  +poisRouteMapping: PoisRouteMappingType,
  +resourceCache: ResourceCacheStateType,
  +searchRoute: SearchRouteType | null,
  +newsRouteMapping: NewsRouteMappingType
|}

export const defaultCityContentState = null

export type StateType = {|
  +darkMode: boolean,
  +resourceCacheUrl: string | null,
  +cityContent: CityContentStateType | null,
  +contentLanguage: string,
  +cities: CitiesStateType
|}
