// @flow

import type { Saga } from 'redux-saga'
import { CategoriesMapModel, createCategoriesEndpoint } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import { baseUrl } from '../constants'
import type { DataContainer } from '../DataContainer'
import AppSettings from '../../settings/AppSettings'

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
  const appSettings = new AppSettings()
  const apiUrlOverride = yield call(appSettings.loadApiUrlOverride)

  const categoriesPayload = yield call(() => createCategoriesEndpoint(apiUrlOverride || baseUrl).request({ city, language }))
  const categoriesMap: CategoriesMapModel = categoriesPayload.data

  yield call(dataContainer.setCategoriesMap, city, language, categoriesMap)
  return categoriesMap
}

export default loadCategories
