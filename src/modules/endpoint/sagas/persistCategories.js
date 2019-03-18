// @flow

import type { Saga } from 'redux-saga'
import MemoryDatabase from '../MemoryDatabase'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import RNFetchblob from 'rn-fetch-blob'
import { call } from 'redux-saga/effects'
import { OFFLINE_CACHE_PATH } from '../../platform/constants/webview'

const strMapToObj = strMap => {
  const obj = Object.create(null)
  for (const [k, v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v
  }
  return obj
}

export default function * persistCategories (database: MemoryDatabase): Saga<void> {
  const categoriesMap = database.categoriesMap
  const categories = categoriesMap.toArray()

  // let start = performanceNow()
  categories.map((category: CategoryModel) => ({
    'path': category.path,
    'title': category.title,
    'content': category.title,
    'last_update': category.lastUpdate,
    'thumbnail': category.thumbnail,
    'available_languages': strMapToObj(category.availableLanguages),
    'parent_path': category.parentPath,
    'children': categoriesMap.getChildren(category).map(category => category.path),
    'order': category.order,
    'hash': '', // fixme
    'file_cache': {
      'https://cms.integreat-app.de/altmuehlfranken/wp-content/uploads/sites/163/2017/11/calendar159-150x150.png': {
        'path': '/data/user/0/com.integreat/cache/altmuehlfranken/2f97435138745.png',
        'updated': '2017-01-22 19:51:10'
      }
    }
  }))
  // let end = performanceNow()
  // console.warn(`mapping to persistable format: ${end - start}ms`)

  // start = performanceNow()
  yield call(RNFetchblob.fs.writeFile, `${OFFLINE_CACHE_PATH}/test.json`, JSON.stringify(categories))
  // end = performanceNow()
  // console.warn(`write: ${end - start}ms`)
}
