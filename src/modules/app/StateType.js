// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'

export type StateType = {
  uiDirection: string,
  language: string | void,
  darkMode: boolean,
  network: { isConnected: boolean, actionQueue: Array<StoreActionType> },
  data: {
    cities: any | void,
    categories: any | void
  },
  _persist: PersistState
}
