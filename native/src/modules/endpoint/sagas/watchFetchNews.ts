import { call, CallEffect, ForkEffect, put, PutEffect, takeLatest } from 'redux-saga/effects'
import {
  FetchMoreNewsActionType,
  FetchNewsActionType,
  FetchNewsFailedActionType,
  PushNewsActionType
} from '../../app/StoreActionType'
import { DataContainer } from '../DataContainer'
import { ErrorCode, fromError } from '../../error/ErrorCodes'
import loadLocalNews from './loadLocalNews'
import loadTunews from './loadTunews'
import loadTunewsLanguages from './loadTunewsLanguages'
import loadTunewsElement from './loadTunewsElement'
import { LOCAL_NEWS_TYPE } from 'api-client/src/routes'
import loadLanguages from './loadLanguages'
import { LanguageModel } from 'api-client/dist/src'
import { NewsModelsType } from '../../app/StateType'

const TUNEWS_FETCH_COUNT_LIMIT = 20
const FIRST_PAGE_INDEX = 1

export function* fetchNews(
  dataContainer: DataContainer,
  action: FetchNewsActionType
): Generator<CallEffect | PutEffect, void, any> {
  const { city, language, newsId, key, type, criterion } = action.params

  try {
    const isLocalNews = type === LOCAL_NEWS_TYPE
    const languages = yield call(loadLanguages, city, dataContainer, criterion.forceUpdate)
    const availableNewsLanguages: Array<LanguageModel> = isLocalNews ? languages : yield call(loadTunewsLanguages, city)
    const validLanguage = availableNewsLanguages.find(languageModel => languageModel.code === language)

    if (validLanguage) {
      const news = isLocalNews
        ? yield call(loadLocalNews, city, language)
        : newsId // A better solution to prevent re-fetching news again from page 1
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
          code: ErrorCode.PageNotFound,
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

export function* fetchMoreNews(
  dataContainer: DataContainer,
  action: FetchMoreNewsActionType
): Generator<CallEffect | PutEffect, void, NewsModelsType | LanguageModel[]> {
  const { city, language, newsId, key, type, page, previouslyFetchedNews } = action.params

  if (type === LOCAL_NEWS_TYPE) {
    throw new Error('Cannot fetch more local news!')
  }

  try {
    const availableLanguages: LanguageModel[] = (yield call(loadTunewsLanguages, city)) as LanguageModel[]
    const news: NewsModelsType = (yield call(loadTunews, city, language, page, TUNEWS_FETCH_COUNT_LIMIT)) as NewsModelsType
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

export default function* (dataContainer: DataContainer): Generator<ForkEffect, any> {
  yield takeLatest('FETCH_NEWS', fetchNews, dataContainer)
  yield takeLatest('FETCH_MORE_NEWS', fetchMoreNews, dataContainer)
}
