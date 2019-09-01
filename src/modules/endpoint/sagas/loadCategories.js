// @flow

import type { Saga } from 'redux-saga'
import { CategoriesMapModel, createCategoriesEndpoint } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import { baseUrl } from '../constants'
import type { FetchMapType } from './fetchResourceCache'
import type { DataContainer } from '../DataContainer'

function * fetchCategoriesMap (city: string, language: string): Saga<CategoriesMapModel> {
  const params = { city, language }

  const categoriesPayload: CategoriesMapModel = yield call(() => createCategoriesEndpoint(baseUrl).request(params))
  return categoriesPayload.data
}

function * loadCategories (
  city: string,
  language: string,
  dataContainer: DataContainer,
  shouldUpdate: boolean
): Saga<FetchMapType> {
  const categoriesAvailable = yield call(() => dataContainer.categoriesAvailable(city, language))

  if (!categoriesAvailable || shouldUpdate) {
    // data is already loaded and should not be updated

    console.debug('Fetching categories')

    // TODO: data was loaded but should be incrementally updated. This will be done in NATIVE-3

    const categoriesMap: CategoriesMapModel = yield call(fetchCategoriesMap, city, language)
    yield call(dataContainer.setCategoriesMap, city, language, categoriesMap)
    return categoriesMap
  }
  console.debug('Using cached categories')
  return yield call(dataContainer.getCategoriesMap, city, language)
}

export default loadCategories
