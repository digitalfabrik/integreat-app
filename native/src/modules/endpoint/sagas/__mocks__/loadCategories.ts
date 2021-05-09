import type { DataContainer } from '../../DataContainer'
import type { Saga } from 'redux-saga'
import { CategoriesMapModel } from 'api-client'
import { call } from 'redux-saga/effects'
export default function* loadCategories(
  city: string,
  language: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<CategoriesMapModel> {
  const categoriesAvailable = yield call(() => dataContainer.categoriesAvailable(city, language))

  if (!categoriesAvailable || forceRefresh) {
    if (city === 'augsburg' && language === 'en') {
      return yield call(dataContainer.getCategoriesMap, city, language)
    } else {
      throw new Error('When using this mock you should prepare the DataContainer with "augsburg" and language "en"!')
    }
  }

  return yield call(dataContainer.getCategoriesMap, city, language)
}
