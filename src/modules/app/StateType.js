// @flow

import {
  CategoriesMapModel,
  CategoryModel,
  CityModel,
  EventModel,
  LanguageModel
} from '@integreat-app/integreat-api-client'
import Moment from 'moment'
import { DEFAULT_LANGUAGE } from '../i18n/constants'

export type PathType = string

export type ErrorStateType = {|
  +errorMessage: string
|}

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
  ...CategoryRouteConfigType
|} | {|
  +status: 'error',
  ...CategoryRouteConfigType,
  +message: string
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
  ...EventRouteConfigType
|} | {|
  +status: 'error',
  ...EventRouteConfigType,
  +message: string
|}

export type PageResourceCacheEntryStateType = {|
  +filePath: string,
  +lastUpdate: Moment,
  +hash: string
|}

export type PageResourceCacheStateType = $ReadOnly<{
  [url: string]: PageResourceCacheEntryStateType
}>

export type CityResourceCacheStateType = $ReadOnly<{
  [path: string]: PageResourceCacheStateType
}>

export type ResourceCacheStateType = $ReadOnly<{
  [city: string]: CityResourceCacheStateType
}>

export type CategoriesRouteMappingType = $ReadOnly<{
  [key: string]: CategoryRouteStateType
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
  +message: string
|}

export const defaultCitiesState: CitiesStateType = {
  status: 'error',
  message: 'Cities not yet initialized'
}

export const defaultContentLanguageState = DEFAULT_LANGUAGE

export type SearchRouteType = {|
  +categoriesMap: CategoriesMapModel
|}

export type CityContentStateType = {|
  +city: string,
  +switchingLanguage: boolean,
  +languages: ?$ReadOnlyArray<LanguageModel>,
  +categoriesRouteMapping: CategoriesRouteMappingType,
  +eventsRouteMapping: EventsRouteMappingType,
  +resourceCache: CityResourceCacheStateType | ErrorStateType,
  +searchRoute: SearchRouteType | null
|}

export const defaultCityContentState = null

export type StateType = {|
  +darkMode: boolean,

  +cityContent: CityContentStateType | null,
  +contentLanguage: string,
  +cities: CitiesStateType
|}
