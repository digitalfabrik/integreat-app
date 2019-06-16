// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import type { FetchEventActionType, FetchEventFailedActionType, PushEventActionType } from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import DatabaseContext from '../DatabaseContext'

function * fetchEvent (dataContainer: DataContainer, action: FetchEventActionType): Saga<void> {
  const {city, language, path, key, criterion} = action.params
  try {
    const loadCriterion = new ContentLoadCriterion(criterion)
    yield call(loadCityContent,
      dataContainer, city, language,
      loadCriterion
    )

    const context = new DatabaseContext(city, language)
    const [events, resourceCache, languages] = yield all([
      call(dataContainer.getEvents, context),
      call(dataContainer.getResourceCache, context),
      call(dataContainer.getLanguages, context)
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
        language,
        peek: loadCriterion.peek()
      }
    }
    yield put(insert)
  } catch (e) {
    console.error(e)
    const failed: FetchEventFailedActionType = {
      type: `FETCH_EVENT_FAILED`,
      params: {
        message: `Error in fetchEvent: ${e.message}`
      }
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`FETCH_EVENT`, fetchEvent, dataContainer)
}
