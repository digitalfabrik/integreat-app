// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import type {
  FetchNewsActionType,
  PushNewsActionType,
  FetchNewsFailedActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import isPeekingRoute from '../selectors/isPeekingRoute'
import ErrorCodes, { fromError } from '../../error/ErrorCodes'
import { tuNewsApiUrl, baseUrl } from '../constants'
import { LOCAL } from '../../../routes/news/containers/NewsContainer'
const localNewsPath = 'wp-json/extensions/v3/fcm?channel=news'
const NEWS_FETCH_COUNT_LIMIT = 20

export function * fetchNews (
  dataContainer: DataContainer,
  action: FetchNewsActionType
): Saga<void> {
  const { city, language, path, key, criterion, type } = action.params

  try {
    const peeking = yield select(state =>
      isPeekingRoute(state, { routeCity: city })
    )
    const isNewsLocal = type === LOCAL

    const loadCriterion = new ContentLoadCriterion(criterion, peeking)
    const languageValid = yield call(
      loadCityContent,
      dataContainer,
      city,
      language,
      loadCriterion
    )

    // Only get languages if we've loaded them, otherwise we're peeking
    const cityLanguages = loadCriterion.shouldLoadLanguages()
      ? yield call(dataContainer.getLanguages, city)
      : []

    if (languageValid) {
      const fetchData = url => fetch(url).then(res => res.json())
      const newsApiUrl = isNewsLocal
        ? `${baseUrl}/${'testumgebung' ||
            city}/${language}/${localNewsPath}`
        : `${tuNewsApiUrl}${language}?page=1&count=${NEWS_FETCH_COUNT_LIMIT}`

      const [newsList, resourceCache] = yield all([
        call(fetchData, newsApiUrl, city, language)
      ])

      const insert: PushNewsActionType = {
        type: 'PUSH_NEWS',
        params: {
          newsList,
          resourceCache,
          path,
          cityLanguages,
          key,
          language,
          city,
          type,
          page: 1,
          hasMoreNews: true
        }
      }
      yield put(insert)
    } else {
      const allAvailableLanguages =
        path === null
          ? new Map(cityLanguages.map(lng => [lng.code, null]))
          : null
      const failed: FetchNewsFailedActionType = {
        type: 'FETCH_NEWS_FAILED',
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
    const failed: FetchNewsFailedActionType = {
      type: 'FETCH_NEWS_FAILED',
      params: {
        message: `Error in fetchNews: ${e.message}`,
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

export function * fetchMoreNews (
  dataContainer: DataContainer,
  action: FetchNewsActionType
): Saga<void> {
  const {
    city,
    language,
    path,
    key,
    criterion,
    type,
    page,
    oldNewsList
  } = action.params
  try {
    const peeking = yield select(state =>
      isPeekingRoute(state, { routeCity: city })
    )
    const isNewsLocal = type === LOCAL

    const loadCriterion = new ContentLoadCriterion(criterion, peeking)
    const languageValid = yield call(
      loadCityContent,
      dataContainer,
      city,
      language,
      loadCriterion
    )

    // Only get languages if we've loaded them, otherwise we're peeking
    const cityLanguages = loadCriterion.shouldLoadLanguages()
      ? yield call(dataContainer.getLanguages, city)
      : []

    if (languageValid) {
      const fetchData = url => fetch(url).then(res => res.json())
      const newsApiUrl = isNewsLocal
        ? `${baseUrl}/${city}/${language}/${localNewsPath}`
        : `${tuNewsApiUrl}${language}?page=${page}&count=${NEWS_FETCH_COUNT_LIMIT}`

      const [newsList, resourceCache] = yield all([
        call(fetchData, newsApiUrl, city, language)
      ])

      const insert: PushNewsActionType = {
        type: 'PUSH_NEWS',
        params: {
          newsList,
          resourceCache,
          oldNewsList,
          path,
          hasMoreNews: newsList.length !== 0,
          cityLanguages,
          key,
          language,
          city,
          type,
          page: page
        }
      }
      yield put(insert)
    } else {
      const allAvailableLanguages =
        path === null
          ? new Map(cityLanguages.map(lng => [lng.code, null]))
          : null
      const failed: FetchNewsFailedActionType = {
        type: 'FETCH_NEWS_FAILED',
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
    const failed: FetchNewsFailedActionType = {
      type: 'FETCH_NEWS_FAILED',
      params: {
        message: `Error in fetchNews: ${e.message}`,
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
  yield takeLatest('FETCH_NEWS', fetchNews, dataContainer)
  yield takeLatest('FETCH_MORE_NEWS', fetchMoreNews, dataContainer)
}
