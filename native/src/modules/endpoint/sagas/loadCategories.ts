import { CategoriesMapModel, createCategoriesEndpoint, Payload } from 'api-client'
import { SagaIterator } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

function* loadCategories(
  city: string,
  language: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaIterator<CategoriesMapModel> {
  const categoriesAvailable: boolean = yield call(() => dataContainer.categoriesAvailable(city, language))

  if (categoriesAvailable && !forceRefresh) {
    try {
      console.debug('Using cached categories')
      return yield call(dataContainer.getCategoriesMap, city, language)
    } catch (e) {
      console.warn('An error occurred while loading categories from JSON', e)
    }
  }

  console.debug('Fetching categories')
  const apiUrl: string = yield call(determineApiUrl)
  const categoriesPayload: Payload<CategoriesMapModel> = yield call(() =>
    createCategoriesEndpoint(apiUrl).request({
      city,
      language
    })
  )
  const categoriesMap = categoriesPayload.data
  if (!categoriesMap) {
    throw new Error('Categories Map not available')
  }
  yield call(dataContainer.setCategoriesMap, city, language, categoriesMap)
  return categoriesMap
}

export default loadCategories
