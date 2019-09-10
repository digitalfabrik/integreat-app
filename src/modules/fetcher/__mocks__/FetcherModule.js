// @flow

import { isEmpty, reduce } from 'lodash'
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

    return Promise.resolve(reduce(targetFilePaths, (result, value, key) => {
      result[key] = { lastUpdate: moment('2016-02-01 10:35:20', 'UTC'), url: value, errorMessage: null }
      return result
    }, {}))
  }
}

export default FetcherModule
