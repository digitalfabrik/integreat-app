// @flow

import type { Saga } from 'redux-saga'
import { isEmpty, reduce } from 'lodash'
import { call, put } from 'redux-saga/effects'
import fnv from 'fnv-plus'
import getExtension from '../getExtension'
import type {
  ResourcesDownloadFailedActionType,
  ResourcesDownloadSucceededActionType
} from '../../app/StoreActionType'
import { OFFLINE_CACHE_PATH } from '../../platform/constants/webview'
import FetcherModule from '../../fetcher/FetcherModule'

export default function * downloadResources (city: string, urls: Array<string>): Saga<void> {
  try {
    const files = {}

    for (const url: string of urls) {
      const hash = fnv.hash(url).hex()
      files[url] = `${OFFLINE_CACHE_PATH}/${city}/${hash}.${getExtension(url)}`
    }

    const result = yield call(FetcherModule.downloadAsync, files)

    if (isEmpty(result.failureMessages)) {
      const message = reduce(result.failureMessages, (message, error, url) => {
        return `${message}'${url}': ${error}\n`
      }, '')

      const failed: ResourcesDownloadFailedActionType = {type: `RESOURCES_DOWNLOAD_FAILED`, city, message}
      yield put(failed)
      return
    }

    const success: ResourcesDownloadSucceededActionType = {
      type: 'RESOURCES_DOWNLOAD_SUCCEEDED', city, files: result
    }
    yield put(success)
  } catch (e) {
    const failed: ResourcesDownloadFailedActionType = {type: `RESOURCES_DOWNLOAD_FAILED`, city, message: e.message}
    yield put(failed)
    throw e
  }
}
