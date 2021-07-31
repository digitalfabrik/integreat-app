import { EventChannel, eventChannel } from 'redux-saga'
import { isEmpty, mapValues, sortBy, toPairs } from 'lodash'
import { FetchResultType, TargetFilePathsType } from '../FetcherModule'

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
      lastUpdate: '2016-02-01T10:35:20Z',
      url: value,
      errorMessage: null as string | null
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
