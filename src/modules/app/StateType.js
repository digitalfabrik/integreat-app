// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'
import { CategoryModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { ResourceCacheType } from '../endpoint/ResourceCacheType'

type PathType = string

export type CategoryRouteStateType = {|
  +root: ?string, // path of the root category
  +depth: number,
  +models: { [path: PathType]: CategoryModel }, /* Models could be stored outside of CategoryRouteStateType
                                                   (e.g. CategoriesStateType) to save memory
                                                   in the state. This would be an optimization! */
  +children: { [path: PathType]: Array<PathType> }
|}

export type EventRouteStateType = {|
  +path: string | null,
  +models: Array<EventModel>
|}

export const defaultRouteState: CategoryRouteStateType = {
  root: null,
  models: {},
  children: {},
  depth: 0
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

export type CityContentStateType = {|
  +language: string | null,
  +city: string | null,
  +languages: Array<LanguageModel> | null,
  +categoriesRouteMapping: CategoriesRouteMappingType,
  +eventsRouteMapping: EventsRouteMappingType,
  +categoriesResourceCache: ResourceCacheType,
  +eventsResourceCache: ResourceCacheType
|}

export const defaultCityContentState: CityContentStateType = {
  language: null,
  city: null,
  languages: null,
  categoriesRouteMapping: {},
  eventsRouteMapping: {},
  categoriesResourceCache: {},
  eventsResourceCache: {}
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
