// @flow

import type { Saga } from 'redux-saga'
import { call, fork, join, put, takeLatest } from 'redux-saga/effects'
import type {
  CategoriesFetchActionType,
  FetchCategoriesRequestActionType
} from '../../app/StoreActionType'
import categoriesEndpoint from '../endpoints/categories'
import languagesEndpoint from '../endpoints/languages'
import LanguageModel from '../models/LanguageModel'
import CategoriesMapModel from '../models/CategoriesMapModel'
import htmlparser2 from 'htmlparser2'
import CategoryModel from '../models/CategoryModel'
import downloadResources from './downloadResources'
import getExtension from '../getExtension'

const parseCategories = (categories) => {
  const urls = new Set<string>()

  const onattribute = (name: string, value: string) => {
    if (name === 'href' || name === 'src') {
      if (['png', 'jpg', 'jpeg', 'pdf'].includes(getExtension(value))) {
        urls.add(value)
      }
    }
  }

  // const urls = new Set()
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

function * fetchByLanguage (city: string, code: string, urls: Set<string>): Saga<void> {
  try {
    const categoriesPayload = yield call(categoriesEndpoint._loadData.bind(categoriesEndpoint), {
      city,
      language: code
    })
    const categoriesMap: CategoriesMapModel = categoriesEndpoint.mapResponse(categoriesPayload.data, {
      city,
      language: code
    })
    const categories = categoriesMap.toArray()

    parseCategories(categories).forEach(url => urls.add(url))

    const success: CategoriesFetchActionType = {
      type: `CATEGORIES_FETCH_SUCCEEDED`,
      payload: categoriesPayload,
      language: code,
      city: city
    }

    yield put(success)
  } catch (e) {
    const failed: CategoriesFetchActionType = {type: `CATEGORIES_FETCH_FAILED`, message: e.message}
    yield put(failed)
  }
}

function * fetch (action: FetchCategoriesRequestActionType): Saga<void> {
  const city: string = action.params.city
  const prioritised: string = action.params.prioritisedLanguage
  const languagesPayload = yield call(languagesEndpoint._loadData.bind(languagesEndpoint), {city: city})
  const languageModels: Array<LanguageModel> = languagesEndpoint.mapResponse(languagesPayload.data, {city: city})
  const codes = languageModels.map(model => model.code)

  const urls = new Set<string>()

  if (codes.includes(prioritised)) {
    yield call(fetchByLanguage, city, prioritised, urls)
  }

  const otherCodes = codes.filter(value => value !== prioritised)

  const fetchTasks = []
  for (const code: string of otherCodes) {
    const task = yield fork(fetchByLanguage, city, code, urls)
    fetchTasks.push(task)
  }

  // $FlowFixMe
  yield join(...fetchTasks)

  yield call(downloadResources, city, Array.from(urls))
}

export default function * fetchSaga (): Saga<void> {
  yield takeLatest(`FETCH_${categoriesEndpoint.stateName.toUpperCase()}_REQUEST`, fetch)
}
