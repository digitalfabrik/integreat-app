// @flow

import type { Saga } from 'redux-saga'
import { Channel } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'
import RNFetchBlob from 'rn-fetch-blob'
import fnv from 'fnv-plus'

const fetchResource = async (url: string) => {
  try {
    const hash = fnv.hash(url).hex()
    const path = `${RNFetchBlob.fs.dirs.DocumentDir}/${hash}`

    if (RNFetchBlob.fs.exists(path)) {
      return hash
    }

    const config = RNFetchBlob.config({path})
    await config.fetch('GET', url)
    return hash
  } catch (e) {
    console.error('Failed to download url  ', url)
  }
}

export default function * fetchResources (chan: Channel): Saga<void> {
  while (true) {
    const payload = yield take(chan)

    const downloaded = {}

    for (const url: string of payload.urls) {
      const hash = yield call(fetchResource, url)
      downloaded[hash] = url
    }

    yield put({type: 'RESOURCES_DOWNLOAD_SUCCEEDED', city: payload.city, language: payload.language, downloaded})
  }
}
