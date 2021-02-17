// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type {
  FetchNewsActionType,
  PushNewsActionType,
  FetchNewsFailedActionType,
  FetchMoreNewsActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import ErrorCodes, { fromError } from '../../error/ErrorCodes'
import loadLocalNews from './loadLocalNews'
import loadTunews from './loadTunews'
import loadTunewsLanguages from './loadTunewsLanguages'
import loadTunewsElement from './loadTunewsElement'
import { LOCAL_NEWS_TYPE } from 'api-client/src/routes'

const TUNEWS_FETCH_COUNT_LIMIT = 20
const FIRST_PAGE_INDEX = 1

export function * fetchNews (
  dataContainer: DataContainer,
  action: FetchNewsActionType
): Saga<void> {
  const { city, language, newsId, key, type } = action.params
  try {
    const isLocalNews = type === LOCAL_NEWS_TYPE

    const languages = yield call(dataContainer.getLanguages, city)
    const availableNewsLanguages = isLocalNews ? languages : yield call(loadTunewsLanguages, city)

    const validLanguage = availableNewsLanguages.find(languageModel => languageModel.code === language)

    if (validLanguage) {
      const news = isLocalNews
        ? yield call(loadLocalNews, city, language)
        : newsId
          // A better solution to prevent re-fetching news again from page 1
          ? yield call(loadTunewsElement, city, language, parseInt(newsId, 0))
          : yield call(loadTunews, city, language, FIRST_PAGE_INDEX, TUNEWS_FETCH_COUNT_LIMIT)

      const insert: PushNewsActionType = {
        type: 'PUSH_NEWS',
        params: {
          news,
          newsId,
          availableLanguages: availableNewsLanguages,
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
      const allAvailableLanguages = !newsId
        ? new Map(availableNewsLanguages.map(language => [language.code, null]))
        : null

      const failed: FetchNewsFailedActionType = {
        type: 'FETCH_NEWS_FAILED',
        params: {
          message: 'Could not load news.',
          code: ErrorCodes.PageNotFound,
          allAvailableLanguages,
          newsId: null,
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
        newsId,
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
    newsId,
    key,
    type,
    page,
    previouslyFetchedNews
  } = action.params

  if (type === LOCAL_NEWS_TYPE) {
    throw new Error('Cannot fetch more local news!')
  }

  try {
    const availableLanguages = yield call(loadTunewsLanguages, city)

    const news = yield call(loadTunews, city, language, page, TUNEWS_FETCH_COUNT_LIMIT)

    const insert: PushNewsActionType = {
      type: 'PUSH_NEWS',
      params: {
        news,
        previouslyFetchedNews,
        newsId,
        hasMoreNews: news.length === TUNEWS_FETCH_COUNT_LIMIT,
        availableLanguages,
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
        newsId,
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
