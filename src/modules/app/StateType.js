// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'
import { CategoryModel, CityModel } from '@integreat-app/integreat-api-client'

export type FilesStateType = { [url: string]: string }

export type LanguageStateType = string

export type CurrentCityStateType = ?string

type PathType = string

export type CategoriesSelectionStateType = {
  +routeMapping: {
    [key: string]: {
      +root: string,
      +depth: number,
      +models: { [path: PathType]: CategoryModel },
      +children: { [path: PathType]: Array<PathType> }
    }
  },

  +currentLanguage: LanguageStateType,
  +currentCity: CurrentCityStateType
}

export const defaultCategoriesSelectionState: CategoriesSelectionStateType = {
  routeMapping: {},

  currentLanguage: 'en',
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
