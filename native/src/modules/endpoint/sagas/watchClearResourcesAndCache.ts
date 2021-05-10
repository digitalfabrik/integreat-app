import { DataContainer } from '../DataContainer'
import { Saga } from 'redux-saga'
import { takeLatest, call, put } from 'redux-saga/effects'
import { ClearResourcesAndCacheActionType } from '../../app/StoreActionType'
export function* clearResourcesAndCache(
  dataContainer: DataContainer,
  action: ClearResourcesAndCacheActionType
): Saga<void> {
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
export default function* (dataContainer: DataContainer): Saga<void> {
  yield takeLatest('CLEAR_RESOURCES_AND_CACHE', clearResourcesAndCache, dataContainer)
}
