// @flow

import { eventChannel } from 'redux-saga'
import type { EventChannel } from 'redux-saga'
import NativeFetcherModule, { NativeFetcherModuleEmitter } from './NativeFetcherModule'
import { isEmpty } from 'lodash'

export type TargetFilePathsType = { [path: string]: string }

export type FetchResultType = { [path: string]: {| lastUpdate: string, url: string, errorMessage: ?string |} }

class FetcherModule {
  // TODO IGAPP-217: Correctly handle already fetching
  static currentlyFetching = false

  createProgressChannel = (): EventChannel<number> => {
    return eventChannel<number>(emitter => {
      const subscription = NativeFetcherModuleEmitter.addListener('progress', emitter)
      return () => subscription.remove()
    })
  }

  fetchAsync = (targetFilePaths: TargetFilePathsType): Promise<FetchResultType> => {
    FetcherModule.currentlyFetching = true

    const fetchPromise: Promise<FetchResultType> = !isEmpty(targetFilePaths) 
      ? NativeFetcherModule.fetchAsync(targetFilePaths) 
      : Promise.resolve({})
    
    fetchPromise.then(result => {
      FetcherModule.currentlyFetching = false

      if (!result) {
        // While testing the app I noticed that the FetchResultType of this function was empty. I am absolutely not sure
        // why this happened. As this cause an inconsistent state it is better to throw an error in this case.
        throw new Error('Fetch failed for some reason!')
      }
    })
    return fetchPromise
  }
}

export default FetcherModule
