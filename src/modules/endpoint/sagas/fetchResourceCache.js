// @flow

import type { Saga } from 'redux-saga'
import { isEmpty, reduce } from 'lodash'
import { call, put } from 'redux-saga/effects'
import type { ResourcesFetchFailedActionType } from '../../app/StoreActionType'
import type { FetchResultType } from '../../fetcher/FetcherModule'
import FetcherModule from '../../fetcher/FetcherModule'
import { invertBy, mapValues, pickBy } from 'lodash/object'
import type { DataContainer } from '../DataContainer'

export type PathType = string
export type UrlType = string
export type FilePathType = string
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
  try {
    const targetUrls = mapValues(fetchMap, ([url]) => url)

    const results = yield call(new FetcherModule().fetchAsync, targetUrls, progress => console.log(progress))

    const successResults = pickBy(results, result => !result.errorMessage)
    const failureResults = pickBy(results, result => !!result.errorMessage)
    if (!isEmpty(failureResults)) {
      // TODO: we might remember which files have failed to retry later (internet connection of client could have failed)
      const message = createErrorMessage(failureResults)
      console.warn(message)
    }

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

    yield call(dataContainer.setResourceCache, city, language, resourceCache)
  } catch (e) {
    console.error(e)
    const failed: ResourcesFetchFailedActionType = {
      type: `FETCH_RESOURCES_FAILED`,
      params: {
        message: `Error in fetchResourceCache: ${e.message}`
      }
    }
    yield put(failed)
    throw e
  }
}
