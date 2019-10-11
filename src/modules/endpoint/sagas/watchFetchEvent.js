// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import type {
  FetchEventActionType,
  FetchEventFailedActionType,
  PushEventActionType,
  PushEventLanguagesActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import isPeekingRoute from '../selectors/isPeekingRoute'

export function * fetchEvent (dataContainer: DataContainer, action: FetchEventActionType): Saga<void> {
  const { city, language, path, key, criterion } = action.params
  try {
    const peeking = yield select(state => isPeekingRoute(state, { routeCity: city }))

    const loadCriterion = new ContentLoadCriterion(criterion, peeking)
    const languageValid = yield call(loadCityContent, dataContainer, city, language, loadCriterion)

    // Only get languages if we've loaded them, otherwise we're peeking
    const cityLanguages = loadCriterion.shouldLoadLanguages() ? yield call(dataContainer.getLanguages, city) : []

    if (languageValid) {
      const [events, resourceCache] = yield all([
        call(dataContainer.getEvents, city, language),
        call(dataContainer.getResourceCache, city, language)
      ])

      const insert: PushEventActionType = {
        type: `PUSH_EVENT`,
        params: { events, resourceCache, path, cityLanguages, key, language, city }
      }
      yield put(insert)
    } else if (path === null) {
      const pushLanguages: PushEventLanguagesActionType = {
        type: `PUSH_EVENT_LANGUAGES`,
        params: {
          allAvailableLanguages: new Map(cityLanguages.map(lng => [lng.code, null])),
          path: null,
          key,
          language,
          city
        }
      }
      yield put(pushLanguages)
    } else {
      const failed: FetchEventFailedActionType = {
        type: `FETCH_EVENT_FAILED`,
        params: {
          message: 'Could not load event.', key, city, language, path
        }
      }
      yield put(failed)
    }
  } catch (e) {
    console.error(e)
    const failed: FetchEventFailedActionType = {
      type: `FETCH_EVENT_FAILED`,
      params: {
        message: `Error in fetchEvent: ${e.message}`, key, city, language, path
      }
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`FETCH_EVENT`, fetchEvent, dataContainer)
}
