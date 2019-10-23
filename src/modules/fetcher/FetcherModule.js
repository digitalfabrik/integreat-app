// @flow

import NativeFetcherModule, { NativeFetcherModuleEmitter } from './NativeFetcherModule'
import { isEmpty } from 'lodash'

export type TargetFilePathsType = {[path: string]: string}

export type FetchResultType = { [path: string]: {| lastUpdate: string, url: string, errorMessage: ?string |} }

export type ProgressCallbackType = (progress: number) => void

class FetcherModule {
  // TODO NATIVE-264: Correctly handle already fetching
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

    const subscriptions = []
    subscriptions.push(NativeFetcherModuleEmitter.addListener('progress', progress))

    try {
      return await NativeFetcherModule.fetchAsync(targetFilePaths)
    } finally {
      subscriptions.forEach(sub => sub.remove())
      FetcherModule.currentlyFetching = false
    }
  }
}

export default FetcherModule
