// @flow

import type { Saga } from 'redux-saga'
import { CategoriesMapModel, createCategoriesEndpoint } from 'api-client'
import { call } from 'redux-saga/effects'
import type { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

function * loadCategories (
  city: string,
  language: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<CategoriesMapModel> {
  const categoriesAvailable = yield call(() => dataContainer.categoriesAvailable(city, language))

  if (categoriesAvailable && !forceRefresh) {
    try {
      console.debug('Using cached categories')
      return yield call(dataContainer.getCategoriesMap, city, language)
    } catch (e) {
      console.warn('An error occurred while loading categories from JSON', e)
    }
  }

  console.debug('Fetching categories')

  const apiUrl = yield call(determineApiUrl)
  const categoriesPayload = yield call(() => createCategoriesEndpoint(apiUrl).request({ city, language }))
  const categoriesMap: CategoriesMapModel = categoriesPayload.data

  yield call(dataContainer.setCategoriesMap, city, language, categoriesMap)
  return categoriesMap
}

export default loadCategories
