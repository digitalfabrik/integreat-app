import { call, put, SagaGenerator, select, takeEvery } from 'typed-redux-saga'

import { cityContentPath, ErrorCode, EVENTS_ROUTE, fromError } from 'api-client'

import { ContentLoadCriterion } from '../models/ContentLoadCriterion'
import { FetchEventActionType, FetchEventFailedActionType, PushEventActionType } from '../redux/StoreActionType'
import isPeekingRoute from '../redux/selectors/isPeekingRoute'
import { DataContainer } from '../utils/DataContainer'
import { getErrorMessage } from '../utils/helpers'
import { reportError } from '../utils/sentry'
import loadCityContent from './loadCityContent'

export function* fetchEvent(dataContainer: DataContainer, action: FetchEventActionType): SagaGenerator<void> {
  const { city, language, path, key, criterion } = action.params

  try {
    const peeking: boolean = yield* select(state =>
      isPeekingRoute(state, {
        routeCity: city,
      })
    )
    const loadCriterion = new ContentLoadCriterion(criterion, peeking)
    const languageValid = yield* call(loadCityContent, dataContainer, city, language, loadCriterion)
    // Only get languages if we've loaded them, otherwise we're peeking
    const cityLanguages = loadCriterion.shouldLoadLanguages() ? yield* call(dataContainer.getLanguages, city) : []

    if (languageValid) {
      const events = yield* call(dataContainer.getEvents, city, language)
      const resourceCache = yield* call(dataContainer.getResourceCache, city, language)

      const lastUpdate = yield* call(dataContainer.getLastUpdate, city, language)
      const refresh = loadCriterion.shouldUpdate(lastUpdate)
      const insert: PushEventActionType = {
        type: 'PUSH_EVENT',
        params: {
          events,
          resourceCache,
          path,
          cityLanguages,
          key,
          language,
          city,
          refresh,
        },
      }
      yield* put(insert)
    } else {
      const allAvailableLanguages = new Map(
        cityLanguages.map(lng => [
          lng.code,
          cityContentPath({
            route: EVENTS_ROUTE,
            cityCode: city,
            languageCode: lng.code,
          }),
        ])
      )
      const failed: FetchEventFailedActionType = {
        type: 'FETCH_EVENT_FAILED',
        params: {
          message: 'Could not load event.',
          code: ErrorCode.PageNotFound,
          allAvailableLanguages,
          path: null,
          key,
          language,
          city,
        },
      }
      yield* put(failed)
    }
  } catch (e) {
    reportError(e)
    const failed: FetchEventFailedActionType = {
      type: 'FETCH_EVENT_FAILED',
      params: {
        message: `Error in fetchEvent: ${getErrorMessage(e)}`,
        code: fromError(e),
        key,
        city,
        language,
        path,
        allAvailableLanguages: null,
      },
    }
    yield* put(failed)
  }
}

export default function* fetchEventSaga(dataContainer: DataContainer): SagaGenerator<void> {
  yield* takeEvery('FETCH_EVENT', fetchEvent, dataContainer)
}
