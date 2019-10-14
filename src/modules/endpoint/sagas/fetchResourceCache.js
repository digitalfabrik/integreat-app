// @flow

import type { Saga } from 'redux-saga'
import { flatten, isEmpty, reduce, values, mapValues, pickBy } from 'lodash'
import { call, put } from 'redux-saga/effects'
import type { ResourcesFetchFailedActionType } from '../../app/StoreActionType'
import type { FetchResultType, TargetFilePathsType } from '../../fetcher/FetcherModule'
import FetcherModule from '../../fetcher/FetcherModule'
import type { DataContainer } from '../DataContainer'
import type { FileCacheStateType } from '../../app/StateType'
import moment from 'moment'

export type FetchMapTargetType = { url: string, filePath: string, urlHash: string }
export type FetchMapType = { [path: string]: Array<FetchMapTargetType> }

const createErrorMessage = (fetchResult: FetchResultType) => {
  return reduce(fetchResult, (message, result, path) =>
    `${message}'Failed to download ${result.url} to ${path}': ${result.errorMessage}\n`, '')
}

export default function * fetchResourceCache (
  city: string,
  language: string,
  fetchMap: FetchMapType,
  dataContainer: DataContainer
): Saga<void> {
  try {
    const fetchMapTargets = flatten<FetchMapTargetType, FetchMapTargetType>(values(fetchMap))
    const targetFilePaths = reduce<Array<FetchMapTargetType>, TargetFilePathsType>(fetchMapTargets, (acc, value) => {
      acc[value.filePath] = value.url
      return acc
    }, {})

    const results = yield call(new FetcherModule().fetchAsync, targetFilePaths, progress => console.log(progress))

    const successResults: FetchResultType = pickBy(results, result => !result.errorMessage)
    const failureResults: FetchResultType = pickBy(results, result => !!result.errorMessage)
    if (!isEmpty(failureResults)) {
      // TODO: we might remember which files have failed to retry later (internet connection of client could have failed)
      const message = createErrorMessage(failureResults)
      console.warn(message)
    }

    const resourceCache = mapValues(fetchMap, fetchMapEntry =>
      reduce<Array<FetchMapTargetType>, FileCacheStateType>(
        fetchMapEntry, (acc, fetchMapTarget: FetchMapTargetType) => {
          const filePath = fetchMapTarget.filePath
          const downloadResult = successResults[filePath]

          if (downloadResult) {
            acc[downloadResult.url] = {
              filePath,
              lastUpdate: moment(downloadResult.lastUpdate),
              hash: fetchMapTarget.urlHash
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
  }
}
