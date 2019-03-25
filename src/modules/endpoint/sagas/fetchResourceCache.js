// @flow

import { Platform } from 'react-native'
import type { Saga } from 'redux-saga'
import { isEmpty, reduce } from 'lodash'
import { call, put } from 'redux-saga/effects'
import type {
  ResourcesDownloadFailedActionType,
  ResourcesDownloadSucceededActionType
} from '../../app/StoreActionType'
import FetcherModule from '../../fetcher/FetcherModule'
import type { FetchResultType } from '../../fetcher/FetcherModule'
import type { ResourceCacheStateType } from '../../app/StateType'
import type { ResourceCacheType } from '../ResourceCacheType'

export default function * fetchResourceCache (city: string, language: string, urls: ResourceCacheStateType): Saga<ResourceCacheType> {
  try {
    let result: FetchResultType = {failureMessages: {}, resourceCache: {}}
    if (Platform.OS === 'android') {
      result = yield call(new FetcherModule().downloadAsync, urls, progress => {})
    }

    if (!isEmpty(result.failureMessages)) {
      const message = reduce(result.failureMessages, (message, error, url) => {
        return `${message}'${url}': ${error}\n`
      }, '')

      const failed: ResourcesDownloadFailedActionType = {type: `RESOURCES_DOWNLOAD_FAILED`, city, language, message}
      yield put(failed)
      return {}
    }

    const success: ResourcesDownloadSucceededActionType = {
      type: 'RESOURCES_DOWNLOAD_SUCCEEDED', city, language
    }
    yield put(success)

    console.dir(result.resourceCache)

    return result.resourceCache
  } catch (e) {
    console.error(e)
    const failed: ResourcesDownloadFailedActionType = {
      type: `RESOURCES_DOWNLOAD_FAILED`, city, language, message: `Error in fetchResourceCache: ${e.message}`
    }
    yield put(failed)
    throw e
  }
}
