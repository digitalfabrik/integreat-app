import { DataContainer } from '../utils/DataContainer'
import { call, put, SagaGenerator, takeLatest } from 'typed-redux-saga'
import { ClearResourcesAndCacheActionType } from '../redux/StoreActionType'

export function* clearResourcesAndCache(
  dataContainer: DataContainer,
  _: ClearResourcesAndCacheActionType
): SagaGenerator<void> {
  console.debug('Clearing Resource Cache')
  dataContainer.clearInMemoryCache()
  yield* call(dataContainer.clearOfflineCache)
  yield* put({
    type: 'FETCH_CITIES',
    params: {
      forceRefresh: true
    }
  })
}

export default function* (dataContainer: DataContainer): SagaGenerator<void> {
  yield* takeLatest('CLEAR_RESOURCES_AND_CACHE', clearResourcesAndCache, dataContainer)
}
