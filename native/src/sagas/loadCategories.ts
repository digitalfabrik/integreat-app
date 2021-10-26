import { call, SagaGenerator } from 'typed-redux-saga'

import { CategoriesMapModel, createCategoriesEndpoint } from 'api-client'

import { DataContainer } from '../utils/DataContainer'
import { determineApiUrl, log, logError } from '../utils/helpers'

function* loadCategories(
  city: string,
  language: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaGenerator<CategoriesMapModel> {
  const categoriesAvailable = yield* call(dataContainer.categoriesAvailable, city, language)

  if (categoriesAvailable && !forceRefresh) {
    try {
      log('Using cached categories')
      return yield* call(dataContainer.getCategoriesMap, city, language)
    } catch (e) {
      log('An error occurred while loading categories from JSON', 'error')
      logError(e)
    }
  }
  log('Fetching categories')
  const apiUrl = yield* call(determineApiUrl)
  const categoriesPayload = yield* call(() =>
    createCategoriesEndpoint(apiUrl).request({
      city,
      language
    })
  )
  const categoriesMap = categoriesPayload.data
  if (!categoriesMap) {
    throw new Error('Categories Map not available')
  }
  yield* call(dataContainer.setCategoriesMap, city, language, categoriesMap)
  return categoriesMap
}

export default loadCategories
