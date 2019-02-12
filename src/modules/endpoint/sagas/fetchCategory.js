// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest, fork, select } from 'redux-saga/effects'
import type {
  SelectCategoryActionType,
  FetchCategoryActionType,
  FetchCategoryFailedActionType,
  SwitchCategorySelectionLanguageActionType
} from '../../app/StoreActionType'
import MemoryDatabase from '../MemoryDatabase'
import {
  categoriesEndpoint,
  CategoriesMapModel,
  LanguageModel,
  languagesEndpoint
} from '@integreat-app/integreat-api-client'
import request from '../request'
import type { ResourceCacheType } from '../ResourceCacheType'
import findResources from '../findResources'
import fnv from 'fnv-plus'
import { OFFLINE_CACHE_PATH } from '../../platform/constants/webview.ios'
import getExtension from '../getExtension'
import DataContext from '../DataContext'
import fetchResourceCache from './fetchResourceCache'
import persistCategories from './persistCategories'
import type { StateType } from '../../app/StateType'

function * fetchCategoriesByLanguage (city: string, code: string): Saga<CategoriesMapModel> {
  const params = {
    city,
    language: code
  }

  const categoriesPayload = yield call(() => request(categoriesEndpoint, params))
  return categoriesPayload.data
}

function * fetchLanguages (city: string): Saga<Array<LanguageModel>> {
  const params = {city}

  const languagesPayload = yield call(() => request(languagesEndpoint, params))
  return languagesPayload.data
}

function * fetchCategories (database: MemoryDatabase, city: string, language: string): Saga<void> {
  const urls: ResourceCacheType = {}

  // const start = performanceNow()
  const languages = yield call(fetchLanguages, city)
  const categoriesMap: CategoriesMapModel = yield call(fetchCategoriesByLanguage, city, language)
  // const end = performanceNow()
  // console.warn(`fetch categories: ${end - start}ms`)

  findResources(categoriesMap.toArray()).forEach(url => {
    const hash = fnv.hash(url).hex()
    urls[url] = `${OFFLINE_CACHE_PATH}/${city}/${hash}.${getExtension(url)}`
  })

  database.changeContext(new DataContext(city, language), categoriesMap, languages, urls)

  yield fork(persistCategories, database)
  yield call(fetchResourceCache, city, language, urls)
}

function * fetchCategory (database: MemoryDatabase, action: FetchCategoryActionType): Saga<void> {
  const {city, language, selectParams} = action.params

  try {
    const currentLanguage = yield select((state: StateType) => state.categoriesSelection.currentLanguage)

    if (!selectParams) {
      // Language Switch
      yield call(fetchCategories, database, city, language)
      const select: SwitchCategorySelectionLanguageActionType = {
        type: `SWITCH_CATEGORY_SELECTION_LANGUAGE`,
        params: {
          categoriesMap: database.categoriesMap,
          newLanguage: language
        }
      }
      yield put(select)
    } else {
      // Fetch new categories
      if (!!currentLanguage && currentLanguage !== language) {
        throw new Error('If you supply a path you should not change the language!')
      }

      yield call(fetchCategories, database, city, language)
      const insert: SelectCategoryActionType = {
        type: `SELECT_CATEGORY`,
        params: {
          categoriesMap: database.categoriesMap,
          languages: database.languages,
          selectParams,
          city,
          language
        }
      }
      yield put(insert)
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
