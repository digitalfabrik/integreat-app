// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import type { FetchEventActionType, FetchEventFailedActionType, PushEventActionType } from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import isPeekingRoute from '../selectors/isPeekingRoute'
import ErrorCodes, { fromError } from '../../error/ErrorCodes'
import type Moment from 'moment'

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

      const lastUpdate: Moment | null = yield call(dataContainer.getLastUpdate, city, language)

      const insert: PushEventActionType = {
        type: loadCriterion.shouldUpdate(lastUpdate) ? 'REFRESH_EVENT' : 'PUSH_EVENT',
        params: { events, resourceCache, path, cityLanguages, key, language, city }
      }
      yield put(insert)
    } else {
      const allAvailableLanguages = path === null ? new Map(cityLanguages.map(lng => [lng.code, null])) : null
      const failed: FetchEventFailedActionType = {
        type: 'FETCH_EVENT_FAILED',
        params: {
          message: 'Could not load event.',
          code: ErrorCodes.PageNotFound,
          allAvailableLanguages,
          path: null,
          key,
          language,
          city
        }
      }
      yield put(failed)
    }
  } catch (e) {
    console.error(e)
    const failed: FetchEventFailedActionType = {
      type: 'FETCH_EVENT_FAILED',
      params: {
        message: `Error in fetchEvent: ${e.message}`,
        code: fromError(e),
        key,
        city,
        language,
        path,
        allAvailableLanguages: null
      }
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest('FETCH_EVENT', fetchEvent, dataContainer)
}
