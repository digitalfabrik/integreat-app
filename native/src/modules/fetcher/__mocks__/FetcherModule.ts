import { eventChannel } from 'redux-saga'
import type { EventChannel } from 'redux-saga'
import { isEmpty, mapValues, sortBy, toPairs } from 'lodash'
import type { FetchResultType, TargetFilePathsType } from '../FetcherModule'
import moment from 'moment'

class FetcherModule {
  static currentlyFetching = false
  createProgressChannel = (): EventChannel<number> => {
    return eventChannel<number>(emitter => {
      emitter(0.5)
      return () => {}
    })
  }
  fetchAsync = (targetFilePaths: TargetFilePathsType): Promise<FetchResultType> => {
    if (FetcherModule.currentlyFetching) {
      throw new Error('Already fetching!')
    }

    if (isEmpty(targetFilePaths)) {
      return Promise.resolve({})
    }

    const fetchResult = mapValues(targetFilePaths, value => ({
      lastUpdate: moment('2016-02-01T10:35:20Z', moment.ISO_8601),
      url: value,
      errorMessage: null
    }))
    const fetchResultPairs = toPairs(fetchResult)
    const sortedPaths = sortBy(fetchResultPairs, ([, result]) => result.url).map(([path]) => path)
    const pseudoRandomPath = sortedPaths[Math.floor(0.7 * sortedPaths.length)]
    fetchResult[pseudoRandomPath].errorMessage =
      'This result is invalid because it is the first result produced by ' + 'the FetcherModule.js mock.'
    return Promise.resolve(fetchResult)
  }
}

export default FetcherModule
