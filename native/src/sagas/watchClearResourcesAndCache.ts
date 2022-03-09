import { call, put, SagaGenerator, takeLatest } from 'typed-redux-saga'

import { ClearResourcesAndCacheActionType } from '../redux/StoreActionType'
import { DataContainer } from '../utils/DataContainer'
import { log } from '../utils/sentry'

export function* clearResourcesAndCache(
  dataContainer: DataContainer,
  _: ClearResourcesAndCacheActionType
): SagaGenerator<void> {
  log('Clearing Resource Cache')
  dataContainer.clearInMemoryCache()
  yield* call(dataContainer.clearOfflineCache)
  yield* put({
    type: 'FETCH_CITIES',
    params: {
      forceRefresh: true
    }
  })
}

export default function* clearResourcesAndCacheSaga(dataContainer: DataContainer): SagaGenerator<void> {
  yield* takeLatest('CLEAR_RESOURCES_AND_CACHE', clearResourcesAndCache, dataContainer)
}
