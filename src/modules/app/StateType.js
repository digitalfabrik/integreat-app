// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'

export type CategoriesStateType = {
  +jsons: { [city: string]: { [language: string]: any } },
  +city: string | void,
  +hashes: { [city: string]: { [language: string]: { [hash: string]: string } } }
}

export type StateType = {
  +uiDirection: string,
  +language: string,
  +darkMode: boolean,
  +network: { +isConnected: boolean, +actionQueue: Array<StoreActionType> },
  +cities: { +json: any | void },
  +categories: CategoriesStateType,
  +_persist?: PersistState
}
