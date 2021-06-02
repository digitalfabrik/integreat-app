import { DataContainer } from '../../DataContainer'
import { CategoriesMapModel } from 'api-client'
import { call, StrictEffect } from 'redux-saga/effects'

export default function* loadCategories(
  city: string,
  language: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Generator<StrictEffect, CategoriesMapModel, boolean | CategoriesMapModel> {
  const categoriesAvailable = (yield call(() => dataContainer.categoriesAvailable(city, language))) as boolean

  if (!categoriesAvailable || forceRefresh) {
    if (city === 'augsburg' && language === 'en') {
      return (yield call(dataContainer.getCategoriesMap, city, language)) as CategoriesMapModel
    } else {
      throw new Error('When using this mock you should prepare the DataContainer with "augsburg" and language "en"!')
    }
  }

  return (yield call(dataContainer.getCategoriesMap, city, language)) as CategoriesMapModel
}
