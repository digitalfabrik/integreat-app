// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'

export type FilesStateType = { [url: string]: string }

export type CategoriesStateType = {
  [city: string]: {|
    +json: { [language: string]: any },
    +error: ?string
  |}
}

export type FileCacheStateType = {
  [city: string]: {|
    +files: FilesStateType,
    +ready: boolean,
    +error: ?string
  |}
}

export type LanguagesStateType = {
  [city: string]: {|
    +languages: { [language: string]: any },
    +error: ?string
  |}
}

export type CitiesStateType = {|
  +json: ?any,
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
  +languages: LanguagesStateType,
  +fileCache: FileCacheStateType,

  +network: {| +isConnected: boolean, +actionQueue: Array<StoreActionType> |},
  +_persist?: PersistState
|}
