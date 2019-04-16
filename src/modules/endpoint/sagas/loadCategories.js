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

function * loadCategories (city: string, language: string, database: MemoryDatabase, shouldUpdate: boolean): Saga<FetchMapType> {
  // Load data from the disk if existent
  yield call(database.readCategories)

  // If data was loaded and should not be updated, return
  if (database.categoriesLoaded() && !shouldUpdate) {
    console.debug('Using cached categories')
    return {}
  }

  console.debug('Fetching categories')

  // TODO: if data was loaded but should be updated incrementally update. This will be done in NATIVE-3

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
