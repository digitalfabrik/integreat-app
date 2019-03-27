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
import type { FetchResultType, TargetFilePathsType } from '../../fetcher/FetcherModule'
import type { ResourceCacheStateType } from '../../app/StateType'
import { invert, invertBy, mapValues } from 'lodash/object'
import { groupBy, keyBy } from 'lodash/collection'
import { fromPairs } from 'lodash/array'

export default function * fetchResourceCache (city: string, language: string, urls: any): Saga<ResourceCacheStateType> {
  try {
    const targetUrls = mapValues(urls, ([url]) => url)

    let result: FetchResultType = {failureMessages: {}, resourceCache: {}}
    if (Platform.OS === 'android') {
      result = yield call(new FetcherModule().downloadAsync, targetUrls, progress => {})
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

    const targetCategories = invertBy(mapValues(urls, ([url, path]) => path))

    console.dir(mapValues(targetCategories, filePaths =>
      fromPairs(filePaths.map(filePath => {
        const downloadResult = result.resourceCache[filePath]
        return [downloadResult.url, {
          path: filePath,
          lastUpdate: downloadResult.lastUpdate
        }]
      }))))

    // console.dir(reduce(result.resourceCache, (result, value, key) => {
    //   result[targetCategories[key]] = {
    //     path: key,
    //     ...value
    //   }
    //
    //   return result
    // }, {}))

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
