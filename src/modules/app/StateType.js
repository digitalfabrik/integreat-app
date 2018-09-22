// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'

export type DownloadedStateType = { [url: string]: string }

export type CategoriesStateType = {|
  // +current_city: string | void,
  +cities: {
    [city: string]: {
      +json: { [language: string]: any },
      +files: DownloadedStateType,
      +download_finished: boolean,
      +error_message: string | void
    }
  }
|}

type CitiesStateType = {|
  +json: any | void,
  +error_message: string | void
|}

export type StateType = {|
  +uiDirection: string,
  +language: string,
  +darkMode: boolean,
  +network: {| +isConnected: boolean, +actionQueue: Array<StoreActionType> |},
  +cities: CitiesStateType,
  +categories: CategoriesStateType,
  +_persist?: PersistState
|}
