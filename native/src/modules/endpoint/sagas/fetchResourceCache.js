// @flow

import type { Saga, Channel } from 'redux-saga'
import { flatten, isEmpty, mapValues, pickBy, reduce, values } from 'lodash'
import { call, put, fork, take } from 'redux-saga/effects'
import type { ResourcesFetchProgressActionType, ResourcesFetchFailedActionType } from '../../app/StoreActionType'
import type { FetchResultType, TargetFilePathsType } from '../../fetcher/FetcherModule'
import FetcherModule from '../../fetcher/FetcherModule'
import type { DataContainer } from '../DataContainer'
import moment from 'moment'
import type { LanguageResourceCacheStateType, PageResourceCacheStateType } from '../../app/StateType'
import { fromError } from '../../error/ErrorCodes'

export type FetchMapTargetType = { url: string, filePath: string, urlHash: string }
export type FetchMapType = { [path: string]: Array<FetchMapTargetType> }

const createErrorMessage = (fetchResult: FetchResultType) => {
  return reduce(fetchResult, (message, result, path) =>
    `${message}'Failed to download ${result.url} to ${path}': ${result.errorMessage}\n`, '')
}

function * watchOnProgress (chan: Channel<number>): Saga<void> {
  let prevStep = 0
  while (true) {
    const progress = yield take(chan)
    const newStep = Math.floor(progress * 10) * 10

    if (newStep <= prevStep) {
      continue
    }

    const progressAction: ResourcesFetchProgressActionType = {
      type: 'FETCH_RESOURCES_PROGRESS',
      params: {
        progress: newStep
      }
    }
    yield put(progressAction)

    prevStep = newStep
  }
}

export default function * fetchResourceCache (
  city: string,
  language: string,
  fetchMap: FetchMapType,
  dataContainer: DataContainer
): Saga<void> {
  try {
    const fetchMapTargets = flatten<FetchMapTargetType, FetchMapTargetType>(values(fetchMap))
    const targetFilePaths = reduce<FetchMapTargetType, TargetFilePathsType>(fetchMapTargets, (acc, value) => {
      acc[value.filePath] = value.url
      return acc
    }, {})

    const fetcher = new FetcherModule()
    const [fetchPromise, progressChannel] = yield call(fetcher.fetchAsync, targetFilePaths)
    if (progressChannel) {
      yield fork(watchOnProgress, progressChannel)
    }
    const results = yield fetchPromise

    const successResults: FetchResultType = pickBy(results, result => !result.errorMessage)
    const failureResults: FetchResultType = pickBy(results, result => !!result.errorMessage)
    if (!isEmpty(failureResults)) {
      // TODO: we might remember which files have failed to retry later (internet connection of client could have failed)
      const message = createErrorMessage(failureResults)
      console.warn(message)
    }

    const resourceCache: LanguageResourceCacheStateType = mapValues(fetchMap, fetchMapEntry =>
      reduce<FetchMapTargetType, PageResourceCacheStateType>(
        fetchMapEntry, (acc: {}, fetchMapTarget: FetchMapTargetType) => {
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
      type: 'FETCH_RESOURCES_FAILED',
      params: {
        message: `Error in fetchResourceCache: ${e.message}`, code: fromError(e)
      }
    }
    yield put(failed)
  }
}
