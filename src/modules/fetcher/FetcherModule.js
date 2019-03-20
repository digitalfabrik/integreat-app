// @flow

import { NativeAppEventEmitter } from 'react-native'
import NativeFetcherModule from './NativeFetcherModule'
import type { ResourceCacheType } from '../endpoint/ResourceCacheType'

export type FetchResultType = {
  failureMessages: { [url: string]: string },
  resourceCache: ResourceCacheType
}

type ProgressCallbackType = (progress: number) => void

class FetcherModule {
  static currentlyDownloading = false

  async downloadAsync (
    targetFilePaths: { [url: string]: string },
    progress: ProgressCallbackType
  ): Promise<FetchResultType> {
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
