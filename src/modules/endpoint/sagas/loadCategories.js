// @flow

import type { Saga } from 'redux-saga'
import { CategoriesMapModel, createCategoriesEndpoint } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import { baseUrl } from '../constants'
import type { FetchMapType } from './fetchResourceCache'
import type { DataContainer } from '../DataContainer'

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

    const categoriesPayload = yield call(() => createCategoriesEndpoint(baseUrl).request({ city, language }))
    const categoriesMap: CategoriesMapModel = categoriesPayload.data
    yield call(dataContainer.setCategoriesMap, city, language, categoriesMap)
    return categoriesMap
  }
  console.debug('Using cached categories')
  return yield call(dataContainer.getCategoriesMap, city, language)
}

export default loadCategories
