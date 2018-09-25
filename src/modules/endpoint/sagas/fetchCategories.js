// @flow

import type { Saga } from 'redux-saga'
import { call, fork, put, takeLatest } from 'redux-saga/effects'
import type {
  CategoriesFetchFailedActionType,
  CategoriesFetchPartiallySucceededActionType,
  CategoriesFetchSucceededActionType,
  FetchCategoriesRequestActionType,
  LanguagesFetchFailedActionType,
  LanguagesFetchSucceededActionType
} from '../../app/StoreActionType'
import categoriesEndpoint from '../endpoints/categories'
import languagesEndpoint from '../endpoints/languages'
import LanguageModel from '../models/LanguageModel'
import CategoriesMapModel from '../models/CategoriesMapModel'
import htmlparser2 from 'htmlparser2'
import CategoryModel from '../models/CategoryModel'
import downloadResources from './downloadResources'
import getExtension from '../getExtension'

const parseCategories = categories => {
  const urls = new Set<string>()

  const onattribute = (name: string, value: string) => {
    if (name === 'href' || name === 'src') {
      if (['png', 'jpg', 'jpeg', 'pdf'].includes(getExtension(value))) {
        urls.add(value)
      }
    }
  }

  const parser = new htmlparser2.Parser({onattribute}, {decodeEntities: true})

  for (const category: CategoryModel of categories) {
    parser.write(category.content)

    if (category.thumbnail) {
      urls.add(category.thumbnail)
    }
  }

  parser.end()
  return urls
}

function * fetchCategories (city: string, code: string, urls: Set<string>): Saga<void> {
  const params = {
    city,
    language: code
  }

  const categoriesPayload = yield call(categoriesEndpoint._loadData.bind(categoriesEndpoint), params)
  const categoriesMap: CategoriesMapModel = categoriesEndpoint.mapResponse(categoriesPayload.data, params)
  const categories = categoriesMap.toArray()

  parseCategories(categories).forEach(url => urls.add(url))

  const partially: CategoriesFetchPartiallySucceededActionType = {
    type: `CATEGORIES_FETCH_PARTIALLY_SUCCEEDED`,
    payload: categoriesPayload,
    language: code,
    city: city
  }
  yield put(partially)
}

function * fetchAllCategories (city: string, codes: Array<string>, prioritised: string): Saga<Set<string>> {
  const urls = new Set<string>()

  if (codes.includes(prioritised)) {
    yield call(fetchCategories, city, prioritised, urls)
  }

  const otherCodes = codes.filter(value => value !== prioritised)

  for (const code: string of otherCodes) {
    yield fork(fetchCategories, city, code, urls)
  }

  return urls
}

function * fetchLanguageCodes (city: string): Saga<Array<string>> {
  try {
    const params = {city}

    const languagesPayload = yield call(languagesEndpoint._loadData.bind(languagesEndpoint), params)
    const languageModels: Array<LanguageModel> = languagesEndpoint.mapResponse(languagesPayload.data, params)
    const codes = languageModels.map(model => model.code)
    const success: LanguagesFetchSucceededActionType = {
      type: 'LANGUAGES_FETCH_SUCCEEDED', payload: languagesPayload, city
    }
    yield put(success)
    return codes
  } catch (e) {
    const failed: LanguagesFetchFailedActionType = {type: `LANGUAGES_FETCH_FAILED`, city, message: e.message}
    yield put(failed)
    throw e
  }
}

function * fetch (action: FetchCategoriesRequestActionType): Saga<void> {
  const city: string = action.params.city

  try {
    const prioritised: string = action.params.prioritisedLanguage

    const codes = yield call(fetchLanguageCodes, city)
    const urls = yield call(fetchAllCategories, city, codes, prioritised)

    const success: CategoriesFetchSucceededActionType = {type: `CATEGORIES_FETCH_SUCCEEDED`, city}
    yield put(success)
    yield call(downloadResources, city, Array.from(urls))
  } catch (e) {
    const failed: CategoriesFetchFailedActionType = {type: `CATEGORIES_FETCH_FAILED`, city, message: e.message}
    yield put(failed)
  }
}

export default function * fetchSaga (): Saga<void> {
  yield takeLatest(`FETCH_CATEGORIES_REQUEST`, fetch)
}
