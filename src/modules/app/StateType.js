// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'
import { CategoryModel, CityModel } from '@integreat-app/integreat-api-client'

export type FilesStateType = { [url: string]: string }

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

export type DirectionStateType = 'ltr' | 'rtl'

export type LanguageStateType = string

export type CurrentCityStateType = ?string

export type StateType = {|
  +uiDirection: DirectionStateType,
  +language: LanguageStateType,
  +currentCity: CurrentCityStateType,
  +darkMode: boolean,

  +citiesSelection: CitiesSelectionStateType,
  +categoriesSelection: CategoriesSelectionStateType,

  +network: {| +isConnected: boolean, +actionQueue: Array<StoreActionType> |},
  +_persist?: PersistState
|}
