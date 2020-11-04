// @flow

import type { Channel } from 'redux-saga'
import NativeFetcherModule, { NativeFetcherModuleEmitter } from './NativeFetcherModule'
import { eventChannel, END } from 'redux-saga'
import { isEmpty } from 'lodash'

export type TargetFilePathsType = { [path: string]: string }

export type FetchResultType = { [path: string]: {| lastUpdate: string, url: string, errorMessage: ?string |} }

class FetcherModule {
  // TODO NATIVE-264: Correctly handle already fetching
  static currentlyFetching = false

  fetchAsync = (targetFilePaths: TargetFilePathsType): [Promise<FetchResultType>, Channel] => {
    if (FetcherModule.currentlyFetching) {
      throw new Error('Already fetching!')
    }

    FetcherModule.currentlyFetching = true

    const progressSubscription = NativeFetcherModuleEmitter.addListener('progress', emit)

    let emit
    const progressChannel = eventChannel<number>(emitter => {
      emit = emitter
      return () => {}
    })
    try {
      var fetchPromise: Promise<FetchResultType>
      if (isEmpty(targetFilePaths)) {
        fetchPromise = Promise.resolve({})
      } else {
        fetchPromise = NativeFetcherModule.fetchAsync(targetFilePaths)
      }

      fetchPromise.then(result => {
        progressSubscription.remove()
        emit(END)
        FetcherModule.currentlyFetching = false

        if (!result) {
          // While testing the app I noticed that the FetchResultType of this function was empty. I am absolutely not sure
          // why this happened. As this cause an inconsistent state it is better to throw an error in this case.
          throw new Error('Fetch failed for some reason!')
        }
      })
      return [fetchPromise, progressChannel]
    } catch {
      progressSubscription.remove()
      emit(END)
      FetcherModule.currentlyFetching = false
    }
  }
}

export default FetcherModule
