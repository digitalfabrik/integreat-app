// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import type { FetchEventActionType, FetchEventFailedActionType, PushEventActionType } from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'

function * fetchEvent (dataContainer: DataContainer, action: FetchEventActionType): Saga<void> {
  const {city, language, path, key, forceUpdate} = action.params
  try {
    yield call(dataContainer.setContext, city, language)
    yield call(loadCityContent, dataContainer, city, language, forceUpdate)

    const [events, languages, resourceCache] = yield all([
      call(dataContainer.getEvents),
      call(dataContainer.getLanguages),
      call(dataContainer.getResourceCache)
    ])

    const insert: PushEventActionType = {
      type: `PUSH_EVENT`,
      params: {
        events,
        languages,
        resourceCache,
        path,
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
      message: `Error in fetchEvent: ${e.message}`
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`FETCH_EVENT`, fetchEvent, dataContainer)
}
