// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import type {
  FetchNewsActionType,
  PushNewsActionType,
  FetchNewsFailedActionType,
  ClearNewsActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import isPeekingRoute from '../selectors/isPeekingRoute'
import ErrorCodes, { fromError } from '../../error/ErrorCodes'
import { LOCAL } from '../../../routes/news/containers/NewsContainer'
import loadLocalNews from './loadLocalNews'
import loadTuNews from './loadTuNews'
import loadLanguages from './loadLanguages'
const NEWS_FETCH_COUNT_LIMIT = 20
const FIRST_PAGE = 1

export function * fetchNews (
  dataContainer: DataContainer,
  action: FetchNewsActionType
): Saga<void> {
  const { city, language, path, key, type } = action.params

  try {
    const isNewsLocal = type === LOCAL
    // Note: Update language each time when switching between news
    const languages = yield call(
      loadLanguages,
      city,
      dataContainer,
      true,
      !isNewsLocal
    )
    const languageValid = languages
      .map(language => language.code)
      .includes(language)
    const pushLanguagesAction = {
      type: 'PUSH_LANGUAGES',
      params: { languages: languages }
    }
    yield put(pushLanguagesAction)

    if (languageValid) {
      const [newsList, resourceCache] = yield all([
        isNewsLocal
          ? call(loadLocalNews, city, language)
          : call(
            loadTuNews,
            language,
            FIRST_PAGE,
            NEWS_FETCH_COUNT_LIMIT
          )
      ])

      const insert: PushNewsActionType = {
        type: 'PUSH_NEWS',
        params: {
          newsList,
          resourceCache,
          path,
          cityLanguages: languages,
          key,
          language,
          city,
          type,
          page: FIRST_PAGE,
          hasMoreNews: true
        }
      }
      yield put(insert)
    } else {
      const allAvailableLanguages =
        path === null
          ? new Map(languages.map(language => [language.code, null]))
          : null

      const failed: FetchNewsFailedActionType = {
        type: 'FETCH_NEWS_FAILED',
        params: {
          message: 'Could not load news.',
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
        message: `Error in fetch news: ${e.message}`,
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

    const loadCriterion = new ContentLoadCriterion(criterion, peeking)

    // Only get languages if we've loaded them, otherwise we're peeking
    const cityLanguages = loadCriterion.shouldLoadLanguages()
      ? yield call(dataContainer.getLanguages, city)
      : []

    const [newsList, resourceCache] = yield all([
      call(
        loadTuNews,
        language,
        page,
        NEWS_FETCH_COUNT_LIMIT
      )
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
  } catch (e) {
    console.error(e)
    const failed: FetchNewsFailedActionType = {
      type: 'FETCH_NEWS_FAILED',
      params: {
        message: `Error in fetch news: ${e.message}`,
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

// Note: added this function when clearing news in case user clicked on tunews
export function * updateLanguages (
  dataContainer: DataContainer,
  action: ClearNewsActionType
): Saga<void> {
  const { city } = action.params
  try {
    const languages = yield call(loadLanguages, city, dataContainer, true)
    const pushLanguagesAction = {
      type: 'PUSH_LANGUAGES',
      params: { languages: languages }
    }
    yield put(pushLanguagesAction)
  } catch (e) {
    console.error(e)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest('FETCH_NEWS', fetchNews, dataContainer)
  yield takeLatest('FETCH_MORE_NEWS', fetchMoreNews, dataContainer)
  yield takeLatest('CLEAR_NEWS', updateLanguages, dataContainer)
}
