// @flow

import type { Saga } from 'redux-saga'
import { NativeModules } from 'react-native'
import { call, put } from 'redux-saga/effects'
import fnv from 'fnv-plus'
import getExtension from '../getExtension'
import type {
  ResourcesDownloadFailedActionType,
  ResourcesDownloadPartiallySucceededActionType,
  ResourcesDownloadSucceededActionType
} from '../../app/StoreActionType'
import { OFFLINE_CACHE_PATH } from '../../platform/constants/webview'

function * downloadResources (city: string, urls: Array<string>): Saga<void> {
  const files = {}

  for (const url: string of urls) {
    const hash = fnv.hash(url).hex()
    files[url] = `${OFFLINE_CACHE_PATH}/${city}/${hash}.${getExtension(url)}`
  }

  try {
    yield call(NativeModules.Fetcher.downloadAsync, files)
  } catch (e) {
    console.error(e)
  }

  const partially: ResourcesDownloadPartiallySucceededActionType = {
    type: 'RESOURCES_DOWNLOAD_PARTIALLY_SUCCEEDED', city, files
  }
  yield put(partially)
}

export default function * prepare (city: string, urls: Array<string>): Saga<void> {
  try {
    yield call(downloadResources, city, urls)

    const success: ResourcesDownloadSucceededActionType = {type: 'RESOURCES_DOWNLOAD_SUCCEEDED', city}
    yield put(success)
  } catch (e) {
    const failed: ResourcesDownloadFailedActionType = {type: `RESOURCES_DOWNLOAD_FAILED`, city, message: e.message}
    yield put(failed)
    throw e
  }
}
