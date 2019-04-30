// @flow

import { Platform } from 'react-native'
import type { Saga } from 'redux-saga'
import { isEmpty, reduce } from 'lodash'
import { call, put } from 'redux-saga/effects'
import type { ResourcesFetchFailedActionType, ResourcesFetchSucceededActionType } from '../../app/StoreActionType'
import type { FetchResultType } from '../../fetcher/FetcherModule'
import FetcherModule from '../../fetcher/FetcherModule'
import { invertBy, mapValues, pickBy } from 'lodash/object'
import MemoryDatabase from '../MemoryDatabase'

type PathType = string
type UrlType = string
type FilePathType = string
export type FetchMapType = { [filePath: FilePathType]: [UrlType, PathType] }

const createErrorMessage = (fetchResult: FetchResultType) => {
  return reduce(fetchResult, (message, result) => {
    if (!result.errorMessage) {
      return message
    }

    return `${message}'Failed to download ${result.url} to ${result.path}': ${result.errorMessage}\n`
  }, '')
}

export default function * fetchResourceCache (city: string, language: string, fetchMap: FetchMapType, database: MemoryDatabase): Saga<void> {
  yield call(database.readResourceCache)

  if (isEmpty(fetchMap)) {
    const success: ResourcesFetchSucceededActionType = {
      type: 'RESOURCES_FETCH_SUCCEEDED', city, language
    }
    yield put(success)

    return
  }

  try {
    const targetUrls = mapValues(fetchMap, ([url]) => url)

    const results: FetchResultType = yield call(new FetcherModule().fetchAsync, targetUrls, progress => console.log(progress))

    const successResults = pickBy(results, result => !result.errorMessage)
    const failureResults = pickBy(results, result => !!result.errorMessage)
    if (!isEmpty(failureResults)) {
      const message = createErrorMessage(failureResults)
      const failed: ResourcesFetchFailedActionType = {type: `RESOURCES_FETCH_FAILED`, city, language, message}
      console.warn(message)
      // todo: we might remember which files have failed to retry later (internet connection of client could have failed)
      yield put(failed)
    }

    const success: ResourcesFetchSucceededActionType = {
      type: 'RESOURCES_FETCH_SUCCEEDED', city, language
    }
    yield put(success)

    const targetCategories: { [categoryPath: PathType]: Array<FilePathType> } =
      invertBy(mapValues(fetchMap, ([url, path]) => path))

    const resourceCache = mapValues(targetCategories, filePaths =>
      reduce(filePaths, (acc, filePath) => {
        const downloadResult = successResults[filePath]
        if (downloadResult) {
          acc[downloadResult.url] = {
            filePath,
            lastUpdate: downloadResult.lastUpdate
          }
        }
        return acc
      }, {})
    )

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
