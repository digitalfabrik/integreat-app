import { CategoriesMapModel, createCategoriesEndpoint, Payload } from 'api-client'
import { StrictEffect, call } from 'redux-saga/effects'
import { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

type GeneratorReturnType = Payload<CategoriesMapModel> | CategoriesMapModel | boolean | string

function* loadCategories(
  city: string,
  language: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Generator<StrictEffect, CategoriesMapModel, GeneratorReturnType> {
  const categoriesAvailable = yield call(() => dataContainer.categoriesAvailable(city, language))

  if (categoriesAvailable && !forceRefresh) {
    try {
      console.debug('Using cached categories')
      return (yield call(dataContainer.getCategoriesMap, city, language)) as CategoriesMapModel
    } catch (e) {
      console.warn('An error occurred while loading categories from JSON', e)
    }
  }

  console.debug('Fetching categories')
  const apiUrl = (yield call(determineApiUrl)) as string
  const categoriesPayload = (yield call(() =>
    createCategoriesEndpoint(apiUrl).request({
      city,
      language
    })
  )) as Payload<CategoriesMapModel>
  const categoriesMap = categoriesPayload.data
  if (!categoriesMap) {
    throw new Error('Categories Map not available')
  }
  yield call(dataContainer.setCategoriesMap, city, language, categoriesMap)
  return categoriesMap
}

export default loadCategories
