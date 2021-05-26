import { call, Effect, ForkEffect, put, select, takeEvery } from 'redux-saga/effects'
import { FetchEventActionType, FetchEventFailedActionType, PushEventActionType } from '../../app/StoreActionType'
import { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import isPeekingRoute from '../selectors/isPeekingRoute'
import { ErrorCode, fromError } from '../../error/ErrorCodes'
import moment, { Moment } from 'moment'
import { EventModel, LanguageModel } from 'api-client'
import { LanguageResourceCacheStateType } from '../../app/StateType'

export function* fetchEvent(
  dataContainer: DataContainer,
  action: FetchEventActionType
): Generator<
  Effect,
  void,
  boolean | Moment | null | LanguageModel | Array<EventModel> | LanguageResourceCacheStateType | Array<LanguageModel>
> {
  const { city, language, path, key, criterion } = action.params

  try {
    const peeking: boolean = (yield select(state =>
      isPeekingRoute(state, {
        routeCity: city
      })
    )) as boolean
    const loadCriterion = new ContentLoadCriterion(criterion, peeking)
    const languageValid = yield call(loadCityContent, dataContainer, city, language, loadCriterion)
    // Only get languages if we've loaded them, otherwise we're peeking
    const cityLanguages: Array<LanguageModel> = loadCriterion.shouldLoadLanguages()
      ? ((yield call(dataContainer.getLanguages, city)) as Array<LanguageModel>)
      : []

    if (languageValid) {
      const events = (yield call(dataContainer.getEvents, city, language)) as Array<EventModel>
      const resourceCache = (yield call(
        dataContainer.getResourceCache,
        city,
        language
      )) as LanguageResourceCacheStateType

      const lastUpdate: moment.Moment | null = (yield call(
        dataContainer.getLastUpdate,
        city,
        language
      )) as Moment | null
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
          refresh
        }
      }
      yield put(insert)
    } else {
      const allAvailableLanguages = path === null ? new Map(cityLanguages.map(lng => [lng.code, null])) : null
      const failed: FetchEventFailedActionType = {
        type: 'FETCH_EVENT_FAILED',
        params: {
          message: 'Could not load event.',
          code: ErrorCode.PageNotFound,
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

export default function* (dataContainer: DataContainer): Generator<ForkEffect, void> {
  yield takeEvery('FETCH_EVENT', fetchEvent, dataContainer)
}
