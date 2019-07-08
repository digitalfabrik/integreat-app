// @flow

import NativeFetcherModule, { NativeFetcherModuleEmitter } from './NativeFetcherModule'
import { isEmpty } from 'lodash'

export type TargetFilePathsType = {[path: string]: string}

export type FetchResultType = { [path: string]: {| lastUpdate: string, url: string, errorMessage: string |} }

type ProgressCallbackType = (progress: number) => void

class FetcherModule {
  async fetchAsync (
    targetFilePaths: TargetFilePathsType,
    progress: ProgressCallbackType
  ): Promise<FetchResultType> {
    if (isEmpty(targetFilePaths)) {
      return Promise.resolve({})
    }

    const subscriptions = []
    subscriptions.push(NativeFetcherModuleEmitter.addListener('progress', progress))

    try {
      return await NativeFetcherModule.fetchAsync(targetFilePaths)
    } finally {
      subscriptions.forEach(sub => sub.remove())
    }
  }
}

export default FetcherModule
