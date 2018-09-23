// @flow

import type { Saga } from 'redux-saga'
import { call, fork, put, takeLatest } from 'redux-saga/effects'
import type { FetchCategoriesRequestActionType } from '../../app/StoreActionType'
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

function * fetchLanguage (city: string, code: string, urls: Set<string>): Saga<void> {
  const params = {
    city,
    language: code
  }

  const categoriesPayload = yield call(categoriesEndpoint._loadData.bind(categoriesEndpoint), params)
  const categoriesMap: CategoriesMapModel = categoriesEndpoint.mapResponse(categoriesPayload.data, params)
  const categories = categoriesMap.toArray()

  parseCategories(categories).forEach(url => urls.add(url))

  yield put({
    type: `CATEGORIES_FETCH_PARTIALLY_SUCCEEDED`,
    payload: categoriesPayload,
    language: code,
    city: city
  })
}

function * fetchAllLanguages (city: string, codes: Array<string>, prioritised: string): Saga<Set<string>> {
  const urls = new Set<string>()

  if (codes.includes(prioritised)) {
    yield call(fetchLanguage, city, prioritised, urls)
  }

  const otherCodes = codes.filter(value => value !== prioritised)

  for (const code: string of otherCodes) {
    yield fork(fetchLanguage, city, code, urls)
  }

  return urls
}

function * fetch (action: FetchCategoriesRequestActionType): Saga<void> {
  const city: string = action.params.city

  try {
    const prioritised: string = action.params.prioritisedLanguage

    const params = {city}

    const languagesPayload = yield call(languagesEndpoint._loadData.bind(languagesEndpoint), params)
    const languageModels: Array<LanguageModel> = languagesEndpoint.mapResponse(languagesPayload.data, params)
    const codes = languageModels.map(model => model.code)

    const urls = yield call(fetchAllLanguages, city, codes, prioritised)

    yield put({type: `CATEGORIES_FETCH_SUCCEEDED`, city})
    yield call(downloadResources, city, Array.from(urls))
  } catch (e) {
    yield put({type: `CATEGORIES_FETCH_FAILED`, city, message: e.message})
  }
}

export default function * fetchSaga (): Saga<void> {
  yield takeLatest(`FETCH_CATEGORIES_REQUEST`, fetch)
}
