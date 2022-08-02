import { flatten, isEmpty, mapValues, pickBy, reduce, values } from 'lodash'
import moment from 'moment'
import { call, cancel, fork, put, SagaGenerator, take } from 'typed-redux-saga'

import { fromError } from 'api-client'

import { PageResourceCacheEntryStateType } from '../redux/StateType'
import { ResourcesFetchFailedActionType, ResourcesFetchProgressActionType } from '../redux/StoreActionType'
import { DataContainer } from '../utils/DataContainer'
import FetcherModule, { FetchResultType, TargetFilePathsType } from '../utils/FetcherModule'
import { getErrorMessage } from '../utils/helpers'
import { log, reportError } from '../utils/sentry'

export type FetchMapTargetType = {
  url: string
  filePath: string
  urlHash: string
}
export type FetchMapType = Record<string, Array<FetchMapTargetType>>

const createErrorMessage = (fetchResult: FetchResultType) =>
  reduce(
    fetchResult,
    (message, result, path) => `${message}'Failed to download ${result.url} to ${path}': ${result.errorMessage}\n`,
    ''
  )

function* watchOnProgress() {
  const channel = new FetcherModule().createProgressChannel()

  try {
    let progress = 0

    while (progress < 1) {
      progress = yield* take(channel)
      const progressAction: ResourcesFetchProgressActionType = {
        type: 'FETCH_RESOURCES_PROGRESS',
        params: {
          progress,
        },
      }
      yield* put(progressAction)
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
): SagaGenerator<void> {
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

    const progressTask = yield* fork(watchOnProgress)
    const results = yield* call(new FetcherModule().fetchAsync, targetFilePaths)
    yield* cancel(progressTask)
    const successResults = pickBy(results, result => !result.errorMessage)
    const failureResults = pickBy(results, result => !!result.errorMessage)

    if (!isEmpty(failureResults)) {
      // TODO: we might remember which files have failed to retry later
      // (internet connection of client could have failed)
      const message = createErrorMessage(failureResults)
      log(message)
    }

    const resourceCache = mapValues(fetchMap, fetchMapEntry =>
      reduce(
        fetchMapEntry,
        (acc: Record<string, PageResourceCacheEntryStateType>, fetchMapTarget: FetchMapTargetType) => {
          const { filePath } = fetchMapTarget
          const downloadResult = successResults[filePath]

          if (downloadResult) {
            acc[downloadResult.url] = {
              filePath,
              lastUpdate: moment(downloadResult.lastUpdate),
              hash: fetchMapTarget.urlHash,
            }
          }

          return acc
        },
        {}
      )
    )
    yield* call(dataContainer.setResourceCache, city, language, resourceCache)
  } catch (e) {
    reportError(e)
    const failed: ResourcesFetchFailedActionType = {
      type: 'FETCH_RESOURCES_FAILED',
      params: {
        message: `Error in fetchResourceCache: ${getErrorMessage(e)}`,
        code: fromError(e),
      },
    }
    yield* put(failed)
  }
}
