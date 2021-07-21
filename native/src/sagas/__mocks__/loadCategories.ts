import { DataContainer } from '../../utils/DataContainer'
import { CategoriesMapModel } from 'api-client'
import { call, SagaGenerator } from 'typed-redux-saga'

export default function* loadCategories(
  city: string,
  language: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaGenerator<CategoriesMapModel> {
  const categoriesAvailable = yield* call(() => dataContainer.categoriesAvailable(city, language))

  if (!categoriesAvailable || forceRefresh) {
    if (city === 'augsburg' && language === 'en') {
      return yield* call(dataContainer.getCategoriesMap, city, language)
    } else {
      throw new Error('When using this mock you should prepare the DataContainer with "augsburg" and language "en"!')
    }
  }

  return yield* call(dataContainer.getCategoriesMap, city, language)
}
