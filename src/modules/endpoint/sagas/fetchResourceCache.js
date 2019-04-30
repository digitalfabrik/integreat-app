// @flow

import type { Saga } from 'redux-saga'
import { isEmpty, reduce } from 'lodash'
import { call, put } from 'redux-saga/effects'
import type { ResourcesFetchFailedActionType, ResourcesFetchSucceededActionType } from '../../app/StoreActionType'
import type { FetchResultType } from '../../fetcher/FetcherModule'
import FetcherModule from '../../fetcher/FetcherModule'
import { invertBy, mapValues, pickBy } from 'lodash/object'
import type { DataContainer } from '../DataContainer'

type PathType = string
type UrlType = string
type FilePathType = string
export type FetchMapType = { [filePath: FilePathType]: [UrlType, PathType] }

const createErrorMessage = (fetchResult: FetchResultType) => {
  return reduce(fetchResult, (message, result, path) => {
    if (!result.errorMessage) {
      return message
    }

    return `${message}'Failed to download ${result.url} to ${path}': ${result.errorMessage}\n`
  }, '')
}

export default function * fetchResourceCache (
  city: string, language: string, fetchMap: FetchMapType, dataContainer: DataContainer): Saga<void> {
  if (isEmpty(fetchMap) && dataContainer.resourceCacheAvailable()) {
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
      // TODO: we might remember which files have failed to retry later (internet connection of client could have failed)
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

    yield call(dataContainer.addResourceCacheEntries, resourceCache)
  } catch (e) {
    console.error(e)
    const failed: ResourcesFetchFailedActionType = {
      type: `RESOURCES_FETCH_FAILED`, city, language, message: `Error in fetchResourceCache: ${e.message}`
    }
    yield put(failed)
    throw e
  }
}
