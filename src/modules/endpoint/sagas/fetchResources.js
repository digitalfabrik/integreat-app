// @flow

import type { Saga } from 'redux-saga'
import { take } from 'redux-saga/effects'
import RNFetchblob from 'rn-fetch-blob'
import { Channel } from 'redux-saga'
import fnv from 'fnv-plus'

export default function * handleRequest (chan: Channel): Saga<void> {
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
