// @flow

import type { Saga } from 'redux-saga'
import { CategoriesMapModel, createCategoriesEndpoint } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import request from '../request'
import { baseUrl } from '../constants'
import findResourceUrls from '../findResourceUrls'
import fnv from 'fnv-plus'
import { getResourceCacheFilesDirPath } from '../../platform/constants/webview.ios'
import getExtension from '../getExtension'
import { keyBy, reduce } from 'lodash/collection'
import type { FetchMapType } from './fetchResourceCache'

function * fetchCategoriesMap (city: string, language: string): Saga<?CategoriesMapModel> {
  const params = {city, language}

  const categoriesPayload: CategoriesMapModel = yield call(() => request(createCategoriesEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * loadCategories (city: string, language: string): Saga<[CategoriesMapModel, FetchMapType]> {
  const categoriesMap: ?CategoriesMapModel = yield call(fetchCategoriesMap, city, language)

  if (!categoriesMap) {
    throw new Error('Failed to load categories!')
  }

  const categories = categoriesMap.toArray()

  const urls: FetchMapType = reduce(categories, (result, category) => {
    const path = category.path

    const urlSet = findResourceUrls(category.content)
    if (category.thumbnail) {
      urlSet.add(category.thumbnail)
    }

    return {
      ...result,
      ...keyBy(Array.from(urlSet).map(url => [url, path]), ([url, path]) => {
        const urlHash = fnv.hash(url).hex()
        const pathHash = fnv.hash(path).hex()
        return `${getResourceCacheFilesDirPath(city)}/${pathHash}/${urlHash}.${getExtension(url)}`
      })
    }
  }, {})

  return [categoriesMap, urls]
}

export default loadCategories
