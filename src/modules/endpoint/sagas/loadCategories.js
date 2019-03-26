// @flow

import type { Saga } from 'redux-saga'
import { CategoriesMapModel, createCategoriesEndpoint } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import request from '../request'
import { baseUrl } from '../constants'
import findResourcesFromHtml from '../findResourcesFromHtml'
import fnv from 'fnv-plus'
import { OFFLINE_CACHE_PATH } from '../../platform/constants/webview.ios'
import getExtension from '../getExtension'
import type { ResourceCacheStateType } from '../../app/StateType'

function * fetchCategoriesMap (city: string, language: string): Saga<?CategoriesMapModel> {
  const params = {city, language}

  const categoriesPayload: CategoriesMapModel = yield call(() => request(createCategoriesEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * loadCategories (city: string, language: string): Saga<[CategoriesMapModel, ResourceCacheStateType]> {
  const categoriesMap: ?CategoriesMapModel = yield call(fetchCategoriesMap, city, language)

  if (!categoriesMap) {
    throw new Error('Failed to load categories!')
  }

  const categories = categoriesMap.toArray()
  const urls = new Set([
    ...findResourcesFromHtml(categories.map(category => category.content)),
    ...categories.map(category => category.thumbnail).filter(thumbnail => !!thumbnail)
  ])

  const resourceCache: ResourceCacheStateType = [...urls].reduce((acc, url) => {
    const hash = fnv.hash(url).hex()
    acc[url] = `${OFFLINE_CACHE_PATH}/${city}/${hash}.${getExtension(url)}`
    return acc
  }, {})

  return [categoriesMap, resourceCache]
}

export default loadCategories
