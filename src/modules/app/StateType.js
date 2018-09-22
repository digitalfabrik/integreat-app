// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'

export type DownloadedStateType = { [city: string]: { [hash: string]: string } }

export type CategoriesStateType = {|
  // +current_city: string | void,
  +cities: {
    [city: string]: {
      +json: { [language: string]: any },
      +files: DownloadedStateType,
      +download_finished: boolean
    }
  }
|}

export type StateType = {|
  +uiDirection: string,
  +language: string,
  +darkMode: boolean,
  +network: {| +isConnected: boolean, +actionQueue: Array<StoreActionType> |},
  +cities: {| +json: any | void |},
  +categories: CategoriesStateType,
  +_persist?: PersistState
|}
