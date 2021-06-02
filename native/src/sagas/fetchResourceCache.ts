import { flatten, isEmpty, mapValues, pickBy, reduce, values } from 'lodash'
import { call, put, fork, take, cancel, StrictEffect, Effect } from 'redux-saga/effects'
import { Task } from 'redux-saga'
import { ResourcesFetchProgressActionType, ResourcesFetchFailedActionType } from '../../app/StoreActionType'
import FetcherModule, { FetchResultType, TargetFilePathsType } from '../../fetcher/FetcherModule'
import { DataContainer } from '../DataContainer'
import moment from 'moment'
import {
  LanguageResourceCacheStateType,
  PageResourceCacheEntryStateType,
  PageResourceCacheStateType
} from '../../app/StateType'
import { fromError } from '../../error/ErrorCodes'

export type FetchMapTargetType = {
  url: string
  filePath: string
  urlHash: string
}
export type FetchMapType = Record<string, Array<FetchMapTargetType>>

const createErrorMessage = (fetchResult: FetchResultType) => {
  return reduce(
    fetchResult,
    (message, result, path) => `${message}'Failed to download ${result.url} to ${path}': ${result.errorMessage}\n`,
    ''
  )
}

function* watchOnProgress(): Generator<StrictEffect, void, number> {
  const channel = new FetcherModule().createProgressChannel()

  try {
    let progress = 0

    while (progress < 1) {
      progress = yield take(channel)
      const progressAction: ResourcesFetchProgressActionType = {
        type: 'FETCH_RESOURCES_PROGRESS',
        params: {
          progress: progress
        }
      }
      yield put(progressAction)
    }
  } finally {
    channel.close()
  }
}

export default function* fetchResourceCache(
  city: string,
  language: string,
  fetchMap: FetchMapType,
  dataContainer: DataContainer
): Generator<StrictEffect, void, Task | FetchResultType> {
  try {
    const fetchMapTargets = flatten<FetchMapTargetType>(values(fetchMap))
    const targetFilePaths = reduce<FetchMapTargetType, TargetFilePathsType>(
      fetchMapTargets,
      (acc, value) => {
        acc[value.filePath] = value.url
        return acc
      },
      {}
    )

    if (FetcherModule.currentlyFetching) {
      throw new Error('Already fetching!')
    }

    const progressTask = (yield fork(watchOnProgress)) as Task
    const results = (yield call(new FetcherModule().fetchAsync, targetFilePaths)) as FetchResultType
    yield cancel(progressTask)
    const successResults: FetchResultType = pickBy(results, result => !result.errorMessage)
    const failureResults: FetchResultType = pickBy(results, result => !!result.errorMessage)

    if (!isEmpty(failureResults)) {
      // TODO: we might remember which files have failed to retry later
      // (internet connection of client could have failed)
      const message = createErrorMessage(failureResults)
      console.log(message)
    }

    const resourceCache: LanguageResourceCacheStateType = mapValues(fetchMap, fetchMapEntry =>
      reduce<FetchMapTargetType, PageResourceCacheStateType>(
        fetchMapEntry,
        (acc: Record<string, PageResourceCacheEntryStateType>, fetchMapTarget: FetchMapTargetType) => {
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
        },
        {} as PageResourceCacheStateType
      )
    )
    yield call(dataContainer.setResourceCache, city, language, resourceCache)
  } catch (e) {
    console.error(e)
    const failed: ResourcesFetchFailedActionType = {
      type: 'FETCH_RESOURCES_FAILED',
      params: {
        message: `Error in fetchResourceCache: ${e.message}`,
        code: fromError(e)
      }
    }
    yield put(failed)
  }
}
