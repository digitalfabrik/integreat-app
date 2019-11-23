// @flow

import type { DataContainer } from '../DataContainer'
import type { Saga } from 'redux-saga'
import { takeLatest, all } from 'redux-saga/effects'
import type { FetchEventActionType } from '../../app/StoreActionType'

export function * clearResourcesAndCache (dataContainer: DataContainer, action: FetchEventActionType): Saga<void> {
  console.log('Clearing Resource Cache')
  yield all([
    dataContainer.clearCaches,
    dataContainer.clearOfflineStorage
  ])
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`CLEAR_RESOURCES_AND_CACHE`, clearResourcesAndCache, dataContainer)
}