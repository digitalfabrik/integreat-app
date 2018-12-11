// @flow

import type { Saga } from 'redux-saga'
import { NativeModules } from 'react-native'
import { call, fork, put } from 'redux-saga/effects'
import RNFetchBlob from 'rn-fetch-blob'
import fnv from 'fnv-plus'
import { chunk } from 'lodash/array'
import getExtension from '../getExtension'
import type {
  ResourcesDownloadFailedActionType,
  ResourcesDownloadPartiallySucceededActionType,
  ResourcesDownloadSucceededActionType
} from '../../app/StoreActionType'
import { OFFLINE_CACHE_PATH, URL_PREFIX } from '../../platform/constants/webview'

const fetchResources = async (files: { [string]: string }) => {
  await NativeModules.Fetcher.downloadAsync(files)
}

const fetchResource = (city: string, url: string) => {
  const hash = fnv.hash(url).hex()
  const path = `${URL_PREFIX}${OFFLINE_CACHE_PATH}/${city}/${hash}.${getExtension(url)}`

  // if (await RNFetchBlob.fs.exists(path)) {
  //   return path
  // }
  //
  // const config = RNFetchBlob.config({path})
  // await config.fetch('GET', encodeURI(url)) // encode url so there are no unsupported chars
  return path
}

function * downloadResources (city: string, urls: Array<string>): Saga<void> {
  const files = {}

  for (const url: string of urls) {
    // files[url] = yield call(fetchResource, city, url)
    files[url] = fetchResource(city, url)
  }

  yield call(fetchResources, files)

  const partially: ResourcesDownloadPartiallySucceededActionType = {
    type: 'RESOURCES_DOWNLOAD_PARTIALLY_SUCCEEDED', city, files
  }
  yield put(partially)
}

function * downloadResourcesChunks (city: string, chunks: Array<Array<string>>): Saga<void> {
  for (const chunk: Array<string> of chunks) {
    yield fork(downloadResources, city, chunk)
  }
}

export default function * prepare (city: string, urls: Array<string>): Saga<void> {
  try {
    const chunks: Array<Array<string>> = chunk(urls, urls.length / 1)

    if (chunks.length) {
      yield call(downloadResourcesChunks, city, chunks)
    }

    const success: ResourcesDownloadSucceededActionType = {type: 'RESOURCES_DOWNLOAD_SUCCEEDED', city}
    yield put(success)
  } catch (e) {
    const failed: ResourcesDownloadFailedActionType = {type: `RESOURCES_DOWNLOAD_FAILED`, city, message: e.message}
    yield put(failed)
    throw e
  }
}
