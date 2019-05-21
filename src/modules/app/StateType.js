// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'
import {
  CategoriesMapModel,
  CategoryModel,
  CityModel,
  EventModel,
  LanguageModel
} from '@integreat-app/integreat-api-client'
import Moment from 'moment'

export type PathType = string

export type CategoryRouteStateType = {|
  +root: string, // path of the root category
  +depth: number,
  +models: { [path: PathType]: CategoryModel }, /* Models could be stored outside of CategoryRouteStateType
                                                   (e.g. CategoriesStateType) to save memory
                                                   in the state. This would be an optimization! */
  +children: { [path: PathType]: Array<PathType> },
  +allAvailableLanguages: Map<string, string>, // including the current content language
  +language: string
|} | {| +error: string |}

export type EventRouteStateType = {|
  +path: string | null,
  +models: Array<EventModel>,
  +allAvailableLanguages: Map<string, string>, // including the current content language
  +language: string
|} | {| +error: string |}

export type FileCacheStateType = {
  [url: string]: {|
    filePath: string,
    lastUpdate: Moment,
    hash: string
  |}
}

export type LanguageResourceCacheStateType = {
  [path: string]: FileCacheStateType
}

export type CityResourceCacheStateType = {
  [language: string]: LanguageResourceCacheStateType
}

export type CategoriesRouteMappingType = {
  [key: string]: CategoryRouteStateType
}

export type EventsRouteMappingType = {
  [key: string]: EventRouteStateType
}

export type CitiesStateType = {|
  +models: Array<CityModel>
|}

export const defaultCitiesState: CitiesStateType = {
  models: []
}

export type SearchRouteType = {|
  +categoriesMap: CategoriesMapModel | null
|}

export type CityContentStateType = {|
  +lastUpdate: Moment | null,
  +language: string | null,
  +city: string | null,
  +languages: Array<LanguageModel> | null,
  +categoriesRouteMapping: CategoriesRouteMappingType,
  +eventsRouteMapping: EventsRouteMappingType,
  +resourceCache: LanguageResourceCacheStateType,
  +searchRoute: SearchRouteType
|}

export const defaultCityContentState: CityContentStateType = {
  lastUpdate: null,
  language: null,
  city: null,
  languages: null,
  categoriesRouteMapping: {},
  eventsRouteMapping: {},
  resourceCache: {},
  searchRoute: {categoriesMap: null}
}

export type DirectionStateType = 'ltr' | 'rtl'

export type StateType = {|
  +uiDirection: DirectionStateType,
  +darkMode: boolean,

  +cityContent: CityContentStateType,
  +cities: CitiesStateType,

  +network: {| +isConnected: boolean, +actionQueue: Array<StoreActionType> |},
  +_persist?: PersistState
|}
