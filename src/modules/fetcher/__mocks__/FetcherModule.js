// @flow

import { isEmpty, mapValues, sortBy, toPairs } from 'lodash'
import type { FetchResultType, ProgressCallbackType, TargetFilePathsType } from '../FetcherModule'
import moment from 'moment-timezone'

class FetcherModule {
  static currentlyFetching = false

  async fetchAsync (
    targetFilePaths: TargetFilePathsType,
    progress: ProgressCallbackType
  ): Promise<FetchResultType> {
    if (FetcherModule.currentlyFetching) {
      return Promise.reject(new Error('Already fetching!'))
    }
    if (isEmpty(targetFilePaths)) {
      return Promise.resolve({})
    }
    FetcherModule.currentlyFetching = true

    for (let i = 0; i < 100; i++) {
      progress(i / 100)
    }

    FetcherModule.currentlyFetching = false

    const fetchResult = mapValues(
      targetFilePaths,
      value => ({ lastUpdate: moment('2016-02-01T10:35:20Z'), url: value, errorMessage: null })
    )

    const fetchResultPairs = toPairs(fetchResult)
    const sortedPaths = sortBy(fetchResultPairs, ([, result]) => result.url).map(([path]) => path)

    const pseudoRandomPath = sortedPaths[Math.floor(0.7 * sortedPaths.length)]

    fetchResult[pseudoRandomPath].errorMessage = 'This result is invalid because it is the first result produced by ' +
      'the FetcherModule.js mock.'

    return Promise.resolve(fetchResult)
  }
}

export default FetcherModule
