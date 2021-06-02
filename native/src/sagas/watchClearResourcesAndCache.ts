import { DataContainer } from '../services/DataContainer'
import { call, put, takeLatest } from 'redux-saga/effects'
import { ClearResourcesAndCacheActionType } from '../redux/StoreActionType'
import { SagaIterator } from 'redux-saga'

export function* clearResourcesAndCache(
  dataContainer: DataContainer,
  action: ClearResourcesAndCacheActionType
): SagaIterator<void> {
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

export default function* (dataContainer: DataContainer): SagaIterator<void> {
  yield takeLatest('CLEAR_RESOURCES_AND_CACHE', clearResourcesAndCache, dataContainer)
}
