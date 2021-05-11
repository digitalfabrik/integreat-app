import { DataContainer } from '../DataContainer'
import { call, CallEffect, ForkEffect, put, PutEffect, takeLatest } from 'redux-saga/effects'
import { ClearResourcesAndCacheActionType } from '../../app/StoreActionType'

export function* clearResourcesAndCache(
  dataContainer: DataContainer,
  action: ClearResourcesAndCacheActionType
): Generator<CallEffect | PutEffect, void> {
  console.debug('Clearing Resource Cache')
  dataContainer.clearInMemoryCache()
  yield call(dataContainer.clearOfflineCache)
  yield put({
    type: 'FETCH_CITIES',
    params: {
      forceRefresh: true
    }
  })
}

export default function* (dataContainer: DataContainer): Generator<ForkEffect, void> {
  yield takeLatest('CLEAR_RESOURCES_AND_CACHE', clearResourcesAndCache, dataContainer)
}
