// @flow

import type { Saga } from 'redux-saga'
import { call, fork, join, put } from 'redux-saga/effects'
import RNFetchBlob from 'rn-fetch-blob'
import fnv from 'fnv-plus'
import { chunk } from 'lodash/array'
import type {
  DownloadResourcesRequestActionType,
  ResourcesDownloadPartiallySucceededActionType,
  ResourcesDownloadSucceededActionType
} from '../../app/StoreActionType'

const fetchResource = async (city: string, url: string) => {
  try {
    const hash = fnv.hash(url).hex()
    const path = `${RNFetchBlob.fs.dirs.DocumentDir}/${city}/${hash}`

    if (await RNFetchBlob.fs.exists(path)) {
      return hash
    }

    const config = RNFetchBlob.config({path})
    await config.fetch('GET', url)
    return path
  } catch (e) {
    console.error('Failed to download url  ', url)
  }
}

function * downloadResources (city: string, urls: Array<string>): Saga<void> {
  const downloaded = {}
  for (const url: string of urls) {
    downloaded[url] = yield call(fetchResource, city, url)
  }

  const downloadSuccess: ResourcesDownloadPartiallySucceededActionType = {
    type: 'RESOURCES_DOWNLOAD_PARTIALLY_SUCCEEDED', city, downloaded
  }
  yield put(downloadSuccess)
}

export default function * prepare (city: string, urls: Array<string>): Saga<void> {
  const downloadRequest: DownloadResourcesRequestActionType = {type: 'DOWNLOAD_RESOURCES_REQUEST'}
  yield put(downloadRequest)

  const downloadTasks = []
  const chunks: Array<Array<string>> = chunk(urls, urls.length / 2)

  if (chunks.length) {
    for (const chunk: Array<string> of chunks) {
      const task = yield fork(downloadResources, city, chunk)
      downloadTasks.push(task)
    }

    // $FlowFixMe
    yield join(...downloadTasks)
  }

  const downloadSuccess: ResourcesDownloadSucceededActionType = {
    type: 'RESOURCES_DOWNLOAD_SUCCEEDED', city
  }
  yield put(downloadSuccess)
}
