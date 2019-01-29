// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type {
  CategoriesFetchFailedActionType,
  CategoriesFetchSucceededActionType,
  FetchCategoriesRequestActionType
} from '../../app/StoreActionType'
import {
  categoriesEndpoint,
  CategoriesMapModel, CategoryModel,
  LanguageModel,
  languagesEndpoint
} from '@integreat-app/integreat-api-client'
import fetchResourceCache from './fetchResourceCache'
import request from '../request'
import findResources from '../findResources'
import MemoryDatabase from '../MemoryDatabase'
import DataContext from '../DataContext'
import type { ResourceCacheType } from '../ResourceCacheType'
import { OFFLINE_CACHE_PATH } from '../../platform/constants/webview.ios'
import getExtension from '../getExtension'
import fnv from 'fnv-plus'
import persistCategories from './persistCategories'
import performanceNow from '../../app/performanceNow'

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

function * fetchLanguagesAndCategories (database: MemoryDatabase, action: FetchCategoriesRequestActionType): Saga<void> {
  const {city, language, path, depth, key} = action.params

  try {
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

    yield call(fetchResourceCache, city, language, urls)
    yield call(persistCategories, database)

    const success: CategoriesFetchSucceededActionType = {
      type: `CATEGORIES_FETCH_SUCCEEDED`,
      payload: {categoriesMap, path, depth, key},
      city,
      language
    }
    yield put(success)
  } catch (e) {
    const failed: CategoriesFetchFailedActionType = {
      type: `CATEGORIES_FETCH_FAILED`,
      message: e.message,
      city,
      language
    }
    yield put(failed)
  }
}

export default function * fetchCategories (database: MemoryDatabase): Saga<void> {
  yield takeLatest(`FETCH_CATEGORIES_REQUEST`, fetchLanguagesAndCategories, database)
}
