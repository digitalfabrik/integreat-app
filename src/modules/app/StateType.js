// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'
import { CategoryModel, CityModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { ResourceCacheType } from '../endpoint/ResourceCacheType'

type PathType = string

export type RouteStateType = {
  +root: ?string,
  +depth: number,
  +models: { [path: PathType]: CategoryModel }, /* Models could be stored outside of RouteStateType
                                                   (e.g. CategoriesStateType) to save memory
                                                   in the state. This would be an optimization! */
  +children: { [path: PathType]: Array<PathType> }
}

export const defaultRouteState: RouteStateType = {
  root: null,
  models: {},
  children: {},
  depth: 0
}

export type CategoriesStateType = {|
  +routeMapping: {
    [key: string]: RouteStateType
  }
|}

export const defaultCategoriesState: CategoriesStateType = {
  routeMapping: {}
}

export type CitiesStateType = {|
  +models: Array<CityModel>
|}

export const defaultCitiesState: CitiesStateType = {
  models: []
}

export type LanguagesStateType = Array<LanguageModel> | null

export type DirectionStateType = 'ltr' | 'rtl'

export type StateType = {|
  +uiDirection: DirectionStateType,
  +darkMode: boolean,
  +resourceCache: ResourceCacheType,

  +languages: LanguagesStateType,
  +currentLanguage: string | null,
  +currentCity: string | null,

  +cities: CitiesStateType,
  +categories: CategoriesStateType,

  +network: {| +isConnected: boolean, +actionQueue: Array<StoreActionType> |},
  +_persist?: PersistState
|}
