// @flow

import type { StoreActionType } from './StoreActionType'
import type { PersistState } from 'redux-persist/src/types'

export type StateType = {
  +uiDirection: string,
  +language: string | void,
  +darkMode: boolean,
  +network: { +isConnected: boolean, +actionQueue: Array<StoreActionType> },
  +data: {
    +cities: { +json: any | void },
    +categories: { +json: any | void, +city: string | void }
  },
  +_persist?: PersistState
}
