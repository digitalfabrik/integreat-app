// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'
import { CategoryModel, CityModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { ResourceCacheType } from '../endpoint/ResourceCacheType'

export type LanguageStateType = string | null

export type CurrentCityStateType = string | null

type PathType = string

export type RouteStateType = {
  +root: ?string,
  +depth: number,
  +models: { [path: PathType]: CategoryModel }, /* Models could be stored outside of RouteStateType
                                                   (e.g. CategoriesSelectionStateType) to save memory
                                                   in the state. This would be an optimization! */
  +children: { [path: PathType]: Array<PathType> }
}

export const defaultRouteState: RouteStateType = {
  root: null,
  models: {},
  children: {},
  depth: 0
}

export type CategoriesSelectionStateType = {
  +routeMapping: {
    [key: string]: RouteStateType
  },
  resourceCache: ResourceCacheType,

  +languages: Array<LanguageModel>,
  +currentLanguage: LanguageStateType,
  +currentCity: CurrentCityStateType
}

export const defaultCategoriesSelectionState: CategoriesSelectionStateType = {
  routeMapping: {},
  resourceCache: {},

  languages: [],
  currentLanguage: null,
  currentCity: null
}

export type CitiesSelectionStateType = {|
  +models: Array<CityModel>
|}

export const defaultCitiesSelectionState: CitiesSelectionStateType = {
  models: []
}

export type DirectionStateType = 'ltr' | 'rtl'

export type StateType = {|
  +uiDirection: DirectionStateType,
  +darkMode: boolean,

  +citiesSelection: CitiesSelectionStateType,
  +categoriesSelection: CategoriesSelectionStateType,

  +network: {| +isConnected: boolean, +actionQueue: Array<StoreActionType> |},
  +_persist?: PersistState
|}
