// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import type {
  FetchNewsActionType,
  PushNewsActionType,
  FetchNewsFailedActionType,
  ClearNewsActionType,
  FetchMoreNewsActionType,
  FetchLanguagesFailedActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import isPeekingRoute from '../selectors/isPeekingRoute'
import ErrorCodes, { fromError } from '../../error/ErrorCodes'
import { LOCAL, TUNEWS } from '../../../routes/news/containers/WithCustomNewsProvider'
import loadLocalNews from './loadLocalNews'
import loadTunews from './loadTunews'
import loadLanguages from './loadLanguages'
import loadTunewsElement from './loadTunewsElement'
import createReduxStore from '../../app/createReduxStore'

const TUNEWS_FETCH_COUNT_LIMIT = 20
const FIRST_PAGE_INDEX = 1

export function * fetchNews (
  dataContainer: DataContainer,
  action: FetchNewsActionType
): Saga<void> {
  const { city, language, path, key, type } = action.params
  try {
    const isLocalNews = type === LOCAL
    // Update language each time when switching between news
    const languages = yield call(
      loadLanguages,
      city,
      dataContainer,
      true,
      !isLocalNews
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
      const [newsList] = yield all([
        isLocalNews
          ? call(loadLocalNews, city, language)
          : path ? yield all(call(loadTunewsElement, path)) // a better solution to prevent re-fetching news again from page 1
            : call(loadTunews, language, FIRST_PAGE_INDEX, TUNEWS_FETCH_COUNT_LIMIT)
      ])

      const insert: PushNewsActionType = {
        type: 'PUSH_NEWS',
        params: {
          newsList,
          path,
          cityLanguages: languages,
          key,
          language,
          city,
          type,
          page: FIRST_PAGE_INDEX,
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
          type,
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
        type,
        path,
        allAvailableLanguages: null
      }
    }
    yield put(failed)
  }
}

export function * fetchMoreNews (
  dataContainer: DataContainer,
  action: FetchMoreNewsActionType
): Saga<void> {
  const {
    city,
    language,
    path,
    key,
    criterion,
    type,
    page,
    previouslyFetchedNewsList
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

    const newsList = yield call(
      loadTunews,
      language,
      page,
      TUNEWS_FETCH_COUNT_LIMIT
    )

    const insert: PushNewsActionType = {
      type: 'PUSH_NEWS',
      params: {
        newsList,
        previouslyFetchedNewsList,
        path,
        hasMoreNews: newsList.length !== 0,
        cityLanguages,
        key,
        language,
        city,
        type,
        page
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
        type,
        path,
        allAvailableLanguages: null
      }
    }
    yield put(failed)
  }
}

// when leaving News page, available languages should be updated according to city
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
    const languagesFailed: FetchLanguagesFailedActionType = {
      type: 'FETCH_LANGUAGES_FAILED',
      params: {
        message: `Error in updateLanguages: ${e.message}`,
        code: fromError(e)
      }
    }
    yield put(languagesFailed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest('FETCH_NEWS', fetchNews, dataContainer)
  yield takeLatest('FETCH_MORE_NEWS', fetchMoreNews, dataContainer)
  yield takeLatest('CLEAR_NEWS', updateLanguages, dataContainer)
}
