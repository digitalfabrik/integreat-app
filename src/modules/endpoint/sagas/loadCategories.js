// @flow

import type { Saga } from 'redux-saga'
import { CategoriesMapModel, createCategoriesEndpoint } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import request from '../request'
import { baseUrl } from '../constants'
import type { FetchMapType } from './fetchResourceCache'
import ResourceURLFinder from '../ResourceURLFinder'
import buildResourceFilePath from '../buildResourceFilePath'
import MemoryDatabase from '../MemoryDatabase'

function * fetchCategoriesMap (city: string, language: string): Saga<?CategoriesMapModel> {
  const params = {city, language}

  const categoriesPayload: CategoriesMapModel = yield call(() => request(createCategoriesEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * loadCategories (city: string, language: string, database: MemoryDatabase): Saga<FetchMapType> {
  // Load data from the disk if existent
  yield call(database.readCategories)

  if (database.categoriesMap) {
    return {}
  }

  const categoriesMap: ?CategoriesMapModel = yield call(fetchCategoriesMap, city, language)

  if (!categoriesMap) {
    throw new Error('Failed to load categories!')
  }

  const categories = categoriesMap.toArray()

  const resourceURLFinder = new ResourceURLFinder()
  resourceURLFinder.init()

  const urls = resourceURLFinder.buildFetchMap(
    categories,
    (url, path) => buildResourceFilePath(url, path, city)
  )

  resourceURLFinder.finalize()

  database.categoriesMap = categoriesMap
  yield call(database.writeCategories)

  return urls
}

export default loadCategories
