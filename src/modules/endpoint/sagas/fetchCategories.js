// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import {
  categoriesEndpoint,
  CategoriesMapModel,
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

  yield call(fetchResourceCache, city, language, urls)
  yield call(persistCategories, database)
}

export default fetchCategories
