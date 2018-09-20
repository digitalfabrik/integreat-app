// @flow

import type { Saga } from 'redux-saga'
import { takeEvery } from 'redux-saga/effects'
import type { ResourcesDownloadSucceededActionType } from '../../app/StoreActionType'
import RNFetchblob from 'rn-fetch-blob'

function * fetchResources (action: ResourcesDownloadSucceededActionType): Saga<void> {


}

export default function * fetchSaga (): Saga<void> {
  yield takeEvery(`CATEGORIES_FETCH_SUCCEEDED`, fetchResources)
}
