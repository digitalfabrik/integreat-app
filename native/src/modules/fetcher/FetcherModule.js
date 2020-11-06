// @flow

import type { EventChannel } from 'redux-saga'
import NativeFetcherModule, { NativeFetcherModuleEmitter } from './NativeFetcherModule'
import { eventChannel } from 'redux-saga'
import { isEmpty } from 'lodash'

export type TargetFilePathsType = { [path: string]: string }

export type FetchResultType = { [path: string]: {| lastUpdate: string, url: string, errorMessage: ?string |} }

class FetcherModule {
  // TODO IGAPP-217: Correctly handle already fetching
  static currentlyFetching = false

  fetchAsync = (targetFilePaths: TargetFilePathsType): [Promise<FetchResultType>, EventChannel<number>] => {
    if (FetcherModule.currentlyFetching) {
      throw new Error('Already fetching!')
    }

    FetcherModule.currentlyFetching = true

    const progressChannel = eventChannel<number>(emitter => {
      const subscription = NativeFetcherModuleEmitter.addListener('progress', emitter)
      return () => subscription.remove()
    })

    const fetchPromise = !isEmpty(targetFilePaths) ? NativeFetcherModule.fetchAsync(targetFilePaths) : Promise.resolve({})
    fetchPromise.then(result => {
      progressChannel.close()
      FetcherModule.currentlyFetching = false

      if (!result) {
        // While testing the app I noticed that the FetchResultType of this function was empty. I am absolutely not sure
        // why this happened. As this cause an inconsistent state it is better to throw an error in this case.
        throw new Error('Fetch failed for some reason!')
      }
    })
    return [fetchPromise, progressChannel]
  }
}

export default FetcherModule
