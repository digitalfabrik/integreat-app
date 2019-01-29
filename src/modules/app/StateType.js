// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'
import { CategoryModel, CityModel } from '@integreat-app/integreat-api-client'

export type FilesStateType = { [url: string]: string }

type PathType = string
export type CategoriesStateType = {
  +models: { [path: PathType]: CategoryModel },
  // +root: ?PathType,
  +children: { [path: PathType]: Array<PathType> },

  +routeMapping: { [key: string]: PathType },

  +lastUpdated: ?string,
  +error: ?string
}

export const defaultCategoriesState: CategoriesStateType = {
  models: {},
  children: {},

  routeMapping: {},

  error: undefined,
  lastUpdated: undefined
}

export type CitiesStateType = {|
  +models: Array<CityModel>,

  +lastUpdated: ?string,
  +error: ?string
|}

export const defaultCitiesState: CitiesStateType = {
  models: [],

  error: undefined,
  lastUpdated: undefined
}

export type DirectionStateType = 'ltr' | 'rtl'

export type LanguageStateType = string

export type CurrentCityStateType = ?string

export type StateType = {|
  +uiDirection: DirectionStateType,
  +language: LanguageStateType,
  +currentCity: CurrentCityStateType,
  +darkMode: boolean,

  +cities: CitiesStateType,
  +categories: CategoriesStateType,

  +network: {| +isConnected: boolean, +actionQueue: Array<StoreActionType> |},
  +_persist?: PersistState
|}
