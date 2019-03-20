// @flow

import type { Saga } from 'redux-saga'
import { call, all, put, select, takeLatest } from 'redux-saga/effects'
import type {
  FetchCategoryActionType,
  FetchCategoryFailedActionType,
  PushCategoryActionType,
  SwitchCategoryLanguageActionType
} from '../../app/StoreActionType'
import MemoryDatabase from '../MemoryDatabase'
import {
  CategoriesMapModel,
  createCategoriesEndpoint,
  createLanguagesEndpoint,
  LanguageModel
} from '@integreat-app/integreat-api-client'
import request from '../request'
import type { ResourceCacheType } from '../ResourceCacheType'
import findResources from '../findResources'
import fnv from 'fnv-plus'
import { OFFLINE_CACHE_PATH } from '../../platform/constants/webview.ios'
import getExtension from '../getExtension'
import MemoryDatabaseContext from '../MemoryDatabaseContext'
import fetchResourceCache from './fetchResourceCache'
import persistCategories from './persistCategories'
import type { StateType } from '../../app/StateType'
import { baseUrl } from '../constants'

function * fetchCategoriesByLanguage (city: string, code: string): Saga<CategoriesMapModel> {
  const params = {
    city,
    language: code
  }

  const categoriesPayload = yield call(() => request(createCategoriesEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * fetchLanguages (city: string): Saga<Array<LanguageModel>> {
  const params = {city}

  const languagesPayload = yield call(() => request(createLanguagesEndpoint(baseUrl), params))
  return languagesPayload.data
}

function * fetchCategories (database: MemoryDatabase, city: string, language: string): Saga<void> {
  // todo evaluate
  if (database.hasContext(new MemoryDatabaseContext(city, language))) {
    return
  }

  const urls: ResourceCacheType = {}

  const languages = yield call(fetchLanguages, city)
  const categoriesMap: CategoriesMapModel = yield call(fetchCategoriesByLanguage, city, language)

  findResources(categoriesMap.toArray()).forEach(url => {
    const hash = fnv.hash(url).hex()
    urls[url] = `${OFFLINE_CACHE_PATH}/${city}/${hash}.${getExtension(url)}`
  })

  database.changeContext(new MemoryDatabaseContext(city, language), categoriesMap, languages, urls)

  yield all([
    call(persistCategories, database),
    call(fetchResourceCache, city, language, urls)
  ])
}

function * fetchCategory (database: MemoryDatabase, action: FetchCategoryActionType): Saga<void> {
  const {city, language, pushParams} = action.params

  try {
    const currentLanguage = yield select((state: StateType) => state.categories.currentLanguage)

    // If there is no language change or no language set fetch and prepare the categories state
    if ((!currentLanguage || currentLanguage === language) && pushParams) {
      yield call(fetchCategories, database, city, language)
      const insert: PushCategoryActionType = {
        type: `PUSH_CATEGORY`,
        params: {
          categoriesMap: database.categoriesMap,
          languages: database.languages,
          resourceCache: database.resourceCache,
          pushParams: pushParams,
          city,
          language
        }
      }
      yield put(insert)
    } else {
      yield call(fetchCategories, database, city, language)
      const select: SwitchCategoryLanguageActionType = {
        type: `SWITCH_CATEGORY_LANGUAGE`,
        params: {
          newCategoriesMap: database.categoriesMap,
          newLanguage: language
        }
      }
      yield put(select)
    }
  } catch (e) {
    const failed: FetchCategoryFailedActionType = {
      type: `FETCH_CATEGORY_FAILED`,
      message: `Error in fetchCategories: ${e.message}`
    }
    yield put(failed)
  }
}

export default function * (database: MemoryDatabase): Saga<void> {
  yield takeLatest(`FETCH_CATEGORY`, fetchCategory, database)
}
