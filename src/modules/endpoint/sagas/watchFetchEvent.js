// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import type { FetchEventActionType, FetchEventFailedActionType, PushEventActionType } from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import DatabaseContext from '../DatabaseContext'

function * fetchEvent (dataContainer: DataContainer, action: FetchEventActionType): Saga<void> {
  const { city, language, path, key, criterion } = action.params
  try {
    const loadCriterion = new ContentLoadCriterion(criterion, false)
    const cityContentLoaded = yield call(loadCityContent,
      dataContainer, city, language,
      loadCriterion
    )
    if (cityContentLoaded) {
      // Only proceed if the content is ready to be pushed to the state. If not then the UI automatically displays an
      // appropriate error
      const [events, resourceCache, languages] = yield all([
        call(dataContainer.getEvents, city, language),
        call(dataContainer.getResourceCache, city, language),
        call(dataContainer.getLanguages, city)
      ])

      const insert: PushEventActionType = {
        type: `PUSH_EVENT`,
        params: {
          events,
          resourceCache,
          path,
          languages,
          key,
          language
        }
      }
      yield put(insert)
    }
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
