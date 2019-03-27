// @flow

import { Platform } from 'react-native'
import type { Saga } from 'redux-saga'
import { isEmpty, reduce } from 'lodash'
import { call, put } from 'redux-saga/effects'
import type {
  ResourcesFetchFailedActionType,
  ResourcesFetchSucceededActionType
} from '../../app/StoreActionType'
import FetcherModule from '../../fetcher/FetcherModule'
import type { FailureMessageType, FetchResultType } from '../../fetcher/FetcherModule'
import type { ResourceCacheStateType } from '../../app/StateType'
import { invertBy, mapValues } from 'lodash/object'
import { fromPairs } from 'lodash/array'

type PathType = string
type UrlType = string
export type FetchMapType = { [filePath: string]: [UrlType, PathType] }

const createErrorMessage = (failureMessages: FailureMessageType) => {
  return reduce(failureMessages, (message, error, url) => {
    return `${message}'${url}': ${error}\n`
  }, '')
}

export default function * fetchResourceCache (city: string, language: string, fetchMap: FetchMapType): Saga<ResourceCacheStateType> {
  try {
    const targetUrls = mapValues(fetchMap, ([url]) => url)

    let result: FetchResultType = {failureMessages: {}, fetchedUrls: {}}

    if (Platform.OS === 'android') {
      result = yield call(new FetcherModule().fetchAsync, targetUrls, progress => {})
    }

    if (!isEmpty(result.failureMessages)) {
      const message = createErrorMessage(result.failureMessages)

      const failed: ResourcesFetchFailedActionType = {type: `RESOURCES_FETCH_FAILED`, city, language, message}
      yield put(failed)
      return {}
    }

    const success: ResourcesFetchSucceededActionType = {
      type: 'RESOURCES_FETCH_SUCCEEDED', city, language
    }
    yield put(success)

    const targetCategories = invertBy(mapValues(fetchMap, ([url, path]) => path))

    return mapValues(targetCategories, filePaths =>
      fromPairs(filePaths.map(filePath => {
        const downloadResult = result.fetchedUrls[filePath]
        return [downloadResult.url, {
          path: filePath,
          lastUpdate: downloadResult.lastUpdate
        }]
      }))
    )
  } catch (e) {
    console.error(e)
    const failed: ResourcesFetchFailedActionType = {
      type: `RESOURCES_FETCH_FAILED`, city, language, message: `Error in fetchResourceCache: ${e.message}`
    }
    yield put(failed)
    throw e
  }
}
