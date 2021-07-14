import { CategoriesMapModel, createCategoriesEndpoint } from 'api-client'
import { call, SagaGenerator } from 'typed-redux-saga'
import { DataContainer } from '../utils/DataContainer'
import { determineApiUrl } from '../utils/helpers'

function* loadCategories(
  city: string,
  language: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaGenerator<CategoriesMapModel> {
  const categoriesAvailable = yield* call(dataContainer.categoriesAvailable, city, language)

  if (categoriesAvailable && !forceRefresh) {
    try {
      console.debug('Using cached categories')
      return yield* call(dataContainer.getCategoriesMap, city, language)
    } catch (e) {
      console.warn('An error occurred while loading categories from JSON', e)
    }
  }

  console.debug('Fetching categories')
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
