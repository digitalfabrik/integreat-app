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
import type { FetchResultType } from '../../fetcher/FetcherModule'
import { invertBy, mapValues, pickBy } from 'lodash/object'
import { fromPairs } from 'lodash/array'
import MemoryDatabase from '../MemoryDatabase'

type PathType = string
type UrlType = string
export type FetchMapType = { [filePath: string]: [UrlType, PathType] }

const createErrorMessage = (fetchResult: FetchResultType) => {
  return reduce(fetchResult, (message, result) => {
    if (!result.errorMessage) {
      return message
    }

    return `${message}'Failed to download ${result.url} to ${result.path}': ${result.errorMessage}\n`
  }, '')
}

export default function * fetchResourceCache (city: string, language: string, fetchMap: FetchMapType, database: MemoryDatabase): Saga<void> {
  console.log('Loading resourceCache from disk')
  yield call(database.readResourceCache)

  if (isEmpty(fetchMap)) {
    console.log('fetchmap empty')
    return
  }

  console.log('Trying to download resources')
  try {
    const targetUrls = mapValues(fetchMap, ([url]) => url)
    console.log('targetUrls', targetUrls)
    if (Platform.OS !== 'android') {
      return
    }

    const results: FetchResultType = yield call(new FetcherModule().fetchAsync, targetUrls, progress => {})

    const successResults = pickBy(results, result => !result.errorMessage)
    const failureResults = pickBy(results, result => !!result.errorMessage)
    console.log('results', successResults, failureResults)
    if (!isEmpty(failureResults)) {
      const message = createErrorMessage(failureResults)

      const failed: ResourcesFetchFailedActionType = {type: `RESOURCES_FETCH_FAILED`, city, language, message}
      yield put(failed)
      return
    }

    const success: ResourcesFetchSucceededActionType = {
      type: 'RESOURCES_FETCH_SUCCEEDED', city, language
    }
    yield put(success)

    const targetCategories = invertBy(mapValues(fetchMap, ([url, path]) => path))

    const resourceCache = mapValues(targetCategories, filePaths =>
      fromPairs(filePaths.map(filePath => {
        const downloadResult = successResults[filePath]
        return [downloadResult.url, {
          path: filePath,
          lastUpdate: downloadResult.lastUpdate
        }]
      }))
    )

    console.log('Storing resourceCache')
    database.addCacheEntries(resourceCache)
    yield call(database.writeResourceCache)
  } catch (e) {
    console.error(e)
    const failed: ResourcesFetchFailedActionType = {
      type: `RESOURCES_FETCH_FAILED`, city, language, message: `Error in fetchResourceCache: ${e.message}`
    }
    yield put(failed)
    throw e
  }
}
