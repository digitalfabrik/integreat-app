// @flow

import type { Saga } from 'redux-saga'
import { CategoriesMapModel, createCategoriesEndpoint } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import request from '../request'
import { baseUrl } from '../constants'
import type { FetchMapType } from './fetchResourceCache'
import ResourceURLFinder from '../ResourceURLFinder'
import buildResourceFilePath from '../buildResourceFilePath'
import type { DataContainer } from '../DataContainer'

function * fetchCategoriesMap (city: string, language: string): Saga<CategoriesMapModel> {
  const params = {city, language}

  const categoriesPayload: CategoriesMapModel = yield call(() => request(createCategoriesEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * loadCategories (
  city: string,
  language: string,
  dataContainer: DataContainer,
  shouldUpdate: boolean
): Saga<FetchMapType> {
  let categories: CategoriesMapModel

  // If data was loaded and should not be updated, return
  if (!dataContainer.categoriesAvailable() || shouldUpdate) {
    console.debug('Fetching categories')

    // TODO: data was loaded but should be incrementally updated. This will be done in NATIVE-3

    const categoriesMap: ?CategoriesMapModel = yield call(fetchCategoriesMap, city, language)

    if (!categoriesMap) {
      throw new Error('Failed to load categories!')
    }

    yield call(dataContainer.setCategoriesMap, categoriesMap)

    categories = categoriesMap
  } else {
    console.debug('Using cached categories')
    categories = yield call(dataContainer.getCategoriesMap)
  }

  const resourceURLFinder = new ResourceURLFinder()
  resourceURLFinder.init()

  const urls = resourceURLFinder.buildFetchMap(
    categories.toArray(),
    (url, path) => buildResourceFilePath(url, path, city)
  )

  resourceURLFinder.finalize()

  return urls
}

export default loadCategories
