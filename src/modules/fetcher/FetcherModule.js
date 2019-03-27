// @flow

import { NativeAppEventEmitter } from 'react-native'
import NativeFetcherModule from './NativeFetcherModule'

export type TargetFilePathsType = {[path: string]: string}

export type FailureMessageType = { [url: string]: string }

export type FetchResultType = {
  failureMessages: FailureMessageType,
  fetchedUrls: { [path: string]: { lastUpdate: string, url: string} }
}

type ProgressCallbackType = (progress: number) => void

class FetcherModule {
  static currentlyFetching = false

  async fetchAsync (
    targetFilePaths: TargetFilePathsType,
    progress: ProgressCallbackType
  ): Promise<FetchResultType> {
    if (FetcherModule.currentlyFetching) {
      return Promise.reject(new Error('Already fetching!'))
    }
    FetcherModule.currentlyFetching = true

    const subscriptions = []
    subscriptions.push(NativeAppEventEmitter.addListener('progress', progress))

    try {
      return await NativeFetcherModule.fetchAsync(targetFilePaths)
    } finally {
      subscriptions.forEach(sub => sub.remove())
      FetcherModule.currentlyFetching = false
    }
  }
}

export default FetcherModule
