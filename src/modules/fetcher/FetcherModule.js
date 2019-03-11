// @flow

import { NativeAppEventEmitter } from 'react-native'
import NativeFetcherModule from './NativeFetcherModule'

export type FetchResultType = {
  failureMessages: { [url: string]: string },
  successFilePaths: { [url: string]: string }
}

type ProgressCallbackType = (progress: number) => void

export type FetcherModuleType = {
  downloadAsync: (
    targetFilePaths: { [url: string]: string },
    progressCallback: ProgressCallbackType
  ) => Promise<FetchResultType>
}

class FetcherModule {
  static currentlyDownloading = false

  async downloadAsync (targetFilePaths: { [url: string]: string }, progress: (progress: number) => void): Promise<FetchResultType> {
    if (FetcherModule.currentlyDownloading) {
      return Promise.reject(new Error('Already downloading!'))
    }
    FetcherModule.currentlyDownloading = true

    const subscriptions = []
    subscriptions.push(NativeAppEventEmitter.addListener('progress', progress))

    try {
      return await NativeFetcherModule.downloadAsync(targetFilePaths)
    } finally {
      subscriptions.forEach(sub => sub.remove())
      FetcherModule.currentlyDownloading = false
    }
  }
}

export default FetcherModule
