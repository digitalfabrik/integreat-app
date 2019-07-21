// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import type { FetchEventActionType, FetchEventFailedActionType, PushEventActionType } from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'

function * fetchEvent (dataContainer: DataContainer, action: FetchEventActionType): Saga<void> {
  const { city, language, path, key, forceUpdate, shouldRefreshResources } = action.params
  try {
    yield call(loadCityContent, dataContainer, city, language, forceUpdate, shouldRefreshResources)

    const [events, resourceCache, languages] = yield all([
      call(dataContainer.getEvents),
      call(dataContainer.getResourceCache),
      call(dataContainer.getLanguages)
    ])

    const insert: PushEventActionType = {
      type: `PUSH_EVENT`,
      params: {
        events,
        resourceCache,
        path,
        languages,
        key,
        city,
        language
      }
    }
    yield put(insert)
  } catch (e) {
    console.error(e)
    const failed: FetchEventFailedActionType = {
      type: `FETCH_EVENT_FAILED`,
      params: {
        message: `Error in fetchEvent: ${e.message}`,
        key
      }
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`FETCH_EVENT`, fetchEvent, dataContainer)
}
