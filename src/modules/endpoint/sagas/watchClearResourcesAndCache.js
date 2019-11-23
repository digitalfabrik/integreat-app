// @flow

import type { DataContainer } from '../DataContainer'
import type { Saga } from 'redux-saga'
import { takeLatest, call, put } from 'redux-saga/effects'
import type { FetchEventActionType } from '../../app/StoreActionType'

export function * clearResourcesAndCache (dataContainer: DataContainer, action: FetchEventActionType): Saga<void> {
  console.debug('Clearing Resource Cache')
  dataContainer.clearCaches()
  yield call(dataContainer.clearOfflineStorage)
  yield put({ type: 'FETCH_CITIES', params: { forceRefresh: true } })
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`CLEAR_RESOURCES_AND_CACHE`, clearResourcesAndCache, dataContainer)
}
