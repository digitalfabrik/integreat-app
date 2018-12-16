// @flow

import type { Saga } from 'redux-saga'
import { NativeModules } from 'react-native'
import { call, put } from 'redux-saga/effects'
import fnv from 'fnv-plus'
import getExtension from '../getExtension'
import type {
  ResourcesDownloadFailedActionType,
  ResourcesDownloadSucceededActionType
} from '../../app/StoreActionType'
import { OFFLINE_CACHE_PATH } from '../../platform/constants/webview'

export default function * downloadResources (city: string, urls: Array<string>): Saga<void> {
  try {
    const files = {}

    for (const url: string of urls) {
      const hash = fnv.hash(url).hex()
      files[url] = `${OFFLINE_CACHE_PATH}/${city}/${hash}.${getExtension(url)}`
    }

    const result = yield call(NativeModules.Fetcher.downloadAsync, files)

    const success: ResourcesDownloadSucceededActionType = {type: 'RESOURCES_DOWNLOAD_SUCCEEDED', city, files}
    yield put(success)
  } catch (e) {
    const failed: ResourcesDownloadFailedActionType = {type: `RESOURCES_DOWNLOAD_FAILED`, city, message: e.message}
    yield put(failed)
    throw e
  }
}
