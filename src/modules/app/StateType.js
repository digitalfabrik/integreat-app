// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'

export type DownloadedStateType = { [city: string]: { [hash: string]: string } } | void

export type CategoriesStateType = {|
  +jsons: { [city: string]: { [language: string]: any } },
  +city: string | void,
  +downloaded: DownloadedStateType
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
