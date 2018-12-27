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

const FetcherModule: FetcherModuleType = {
  downloadAsync: async (targetFilePaths, progress) => {
    const subscriptions = []
    subscriptions.push(NativeAppEventEmitter.addListener('progress', progress))

    try {
      return await NativeFetcherModule.downloadAsync(targetFilePaths)
    } finally {
      subscriptions.forEach(sub => sub.remove())
    }
  }
}
export default FetcherModule
