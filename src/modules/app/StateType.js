// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'

export type FilesStateType = { [url: string]: string }

export type CategoriesStateType = {
  +lastUpdated: ?string,
  +error: ?string
}

export type CitiesStateType = {|
  +lastUpdated: ?string,
  +error: ?string
|}

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
