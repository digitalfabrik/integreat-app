// @flow

import type { Saga } from 'redux-saga'
import MemoryDatabase from '../MemoryDatabase'
import { CategoriesMapModel, createCategoriesEndpoint } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import request from '../request'
import { baseUrl } from '../constants'
import findResourcesFromHtml from '../findResourcesFromHtml'
import type { ResourceCacheType } from '../ResourceCacheType'
import fnv from 'fnv-plus'
import { OFFLINE_CACHE_PATH } from '../../platform/constants/webview.ios'
import getExtension from '../getExtension'

function * fetchCategoriesMap (city: string, language: string): Saga<CategoriesMapModel> {
  const params = {city, language}

  const categoriesPayload = yield call(() => request(createCategoriesEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * loadCategories (database: MemoryDatabase, city: string, language: string): Saga<void> {
  const categoriesMap: CategoriesMapModel = yield call(fetchCategoriesMap, city, language)

  const categories = categoriesMap.toArray()
  const urls = new Set([
    ...findResourcesFromHtml(categories.map(category => category.content)),
    ...categories.map(category => category.thumbnail).filter(thumbnail => !!thumbnail)
  ])

  const cache: ResourceCacheType = [...urls].reduce((acc, url) => {
    const hash = fnv.hash(url).hex()
    acc[url] = `${OFFLINE_CACHE_PATH}/${city}/${hash}.${getExtension(url)}`
    return acc
  }, {})

  database.categoriesMap = categoriesMap
  database.categoriesResourceCache = cache
}

export default loadCategories
