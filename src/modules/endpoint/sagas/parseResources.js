// @flow

import type { Saga } from 'redux-saga'
import { type Channel } from 'redux-saga'
import { put, takeEvery } from 'redux-saga/effects'
import type { CategoriesFetchSucceededActionType } from '../../app/StoreActionType'
import categoriesEndpoint from '../endpoints/categories'
import CategoriesMapModel from '../models/CategoriesMapModel'
import CategoryModel from '../models/CategoryModel'
import htmlparser from 'htmlparser2'

const getExtension = (url: string) => {
  return url.substring(url.lastIndexOf('.') + 1)
}

function * parseResources (channel: Channel, action: CategoriesFetchSucceededActionType): Saga<void> {
  const categoriesMap: CategoriesMapModel = categoriesEndpoint.mapResponse(action.payload.data, {
    city: action.city,
    language: action.language
  })
  const categories = categoriesMap.toArray()

  const onattribute = (name: string, value: string) => {
    if (name === 'href' || name === 'src') {
      if (['png', 'jpg', 'jpeg', 'pdf'].includes(getExtension(value))) {
        urls.add(value)
      }
    }
  }

  const urls = new Set()
  const parser = new htmlparser.Parser({onattribute}, {decodeEntities: true})

  for (const category: CategoryModel of categories) {
    parser.write(category.content)
  }

  parser.end()

  console.log(urls)

  for (const url: string of urls) {
    yield put(channel, {url})
  }
}

export default function * fetchSaga (channel: Channel): Saga<void> {
  yield takeEvery(`CATEGORIES_FETCH_SUCCEEDED`, parseResources, channel)
}
