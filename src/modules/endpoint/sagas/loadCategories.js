// @flow

import type { Saga } from 'redux-saga'
import { CategoriesMapModel, createCategoriesEndpoint } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import request from '../request'
import { baseUrl } from '../constants'
import type { FetchMapType } from './fetchResourceCache'
import ResourceURLFinder from '../ResourceURLFinder'
import buildResourceFilePath from '../buildResourceFilePath'
import DataContainer from '../DataContainer'

function * fetchCategoriesMap (city: string, language: string): Saga<CategoriesMapModel> {
  const params = {city, language}

  const categoriesPayload: CategoriesMapModel = yield call(() => request(createCategoriesEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * loadCategories (city: string, language: string, dataContainer: DataContainerInterface): Saga<FetchMapType> {
  if (dataContainer.categoriesAvailable()) {
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

  yield call(dataContainer.setCategoriesMap, categoriesMap)

  return urls
}

export default loadCategories
