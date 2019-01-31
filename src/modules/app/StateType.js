// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'
import { CategoryModel, CityModel } from '@integreat-app/integreat-api-client'

export type FilesStateType = { [url: string]: string }

export type CategoriesStateType = {
  +lastUpdated: ?string,
  +error: ?string
}

export const defaultCategoriesState: CategoriesStateType = {
  error: undefined,
  lastUpdated: undefined
}

type PathType = string

export type CategoriesSelectionStateType = {
  +models: { [path: PathType]: CategoryModel },
  +children: { [path: PathType]: Array<PathType> },

  +routeMapping: { [key: string]: PathType }
}

export const defaultCategoriesSelectionState: CategoriesSelectionStateType = {
  models: {},
  children: {},
  routeMapping: {}
}

export type CitiesSelectionStateType = {|
  +models: Array<CityModel>
|}

export const defaultCitiesSelectionState: CitiesSelectionStateType = {
  models: []
}

export type CitiesStateType = {|
  +lastUpdated: ?string,
  +error: ?string
|}

export const defaultCitiesState: CitiesStateType = {
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

  +citiesSelection: CitiesSelectionStateType,
  +categoriesSelection: CategoriesSelectionStateType,

  +network: {| +isConnected: boolean, +actionQueue: Array<StoreActionType> |},
  +_persist?: PersistState
|}
