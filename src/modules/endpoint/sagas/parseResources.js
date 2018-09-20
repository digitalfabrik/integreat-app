// @flow

import type { Saga } from 'redux-saga'
import { Channel, channel } from 'redux-saga'
import { call, fork, put, take, takeEvery } from 'redux-saga/effects'
import type { CategoriesFetchSucceededActionType } from '../../app/StoreActionType'
import categoriesEndpoint from '../endpoints/categories'
import CategoriesMapModel from '../models/CategoriesMapModel'
import CategoryModel from '../models/CategoryModel'
import htmlparser from 'htmlparser2'
import RNFetchblob from 'rn-fetch-blob'
import fnv from 'fnv-plus'

const getExtension = (url: string) => {
  return url.substring(url.lastIndexOf('.') + 1)
}

function * parseResources (action: CategoriesFetchSucceededActionType): Saga<void> {
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

  const chan = yield call(channel)

  for (let i = 0; i < 2; i++) {
    yield fork(handleRequest, chan)
  }

  for (const url: string of urls) {
    yield put(chan, { url })
  }
}

function * handleRequest (chan: Channel): Saga<void> {
  while (true) {
    const payload = yield take(chan)
    RNFetchblob.config({
      path: `${RNFetchblob.fs.dirs.DocumentDir}/${fnv.hash(payload.url).hex()}`
    })
      .fetch('GET', payload.url, {'Cache-Control': 'no-store'})
      .then(res => {
        console.log('The file saved to ', res.path())
      })
  }
}

export default function * fetchSaga (): Saga<void> {
  yield takeEvery(`CATEGORIES_FETCH_SUCCEEDED`, parseResources)
}
