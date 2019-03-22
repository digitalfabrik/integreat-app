// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type { FetchEventActionType } from '../../app/StoreActionType'
import MemoryDatabase from '../MemoryDatabase'
import loadCityContent from './loadCityContent'

function * fetchEvent (database: MemoryDatabase, action: FetchEventActionType): Saga<void> {
  const {city, language, pushParams} = action.params
  try {
    yield call(loadCityContent, database, city, language)

    const insert: PushEventActionType = {
      type: `PUSH_EVENT`,
      params: {
        events: database.events,
        resourceCache: database.eventsResourceCache,
        pushParams: pushParams,
        city,
        language
      }
    }
    yield put(insert)
  } catch (e) {
    const failed: FetchEventFailedActionType = {
      type: `FETCH_EVENT_FAILED`,
      message: `Error in fetchEvent: ${e.message}`
    }
    yield put(failed)
  }
}

export default function * (database: MemoryDatabase): Saga<void> {
  yield takeLatest(`FETCH_EVENT`, fetchEvent, database)
}
