import NativeFetcherModule, { NativeFetcherModuleEmitter } from './NativeFetcherModule'
import { isEmpty } from 'lodash'
import { EventChannel } from 'redux-saga'
import { eventChannel } from 'redux-saga'
export type TargetFilePathsType = Record<string, string>
export type FetchResultType = Record<
  string,
  {
    lastUpdate: string
    url: string
    errorMessage: string | null | undefined
  }
>

class FetcherModule {
  // TODO IGAPP-217: Correctly handle already fetching
  static currentlyFetching = false
  createProgressChannel = (): EventChannel<number> => {
    return eventChannel<number>(emitter => {
      let prevStep = 0
      const stepWidthDivider = 20
      const subscription = NativeFetcherModuleEmitter.addListener('progress', (progress: number) => {
        const newStep = Math.floor(progress * stepWidthDivider) / stepWidthDivider

        if (newStep <= prevStep) {
          return
        }

        prevStep = newStep
        emitter(newStep)
      })
      return () => subscription.remove()
    })
  }

  async fetchAsync(targetFilePaths: TargetFilePathsType): Promise<FetchResultType> {
    if (isEmpty(targetFilePaths)) {
      return {}
    }

    FetcherModule.currentlyFetching = true

    try {
      const result = await NativeFetcherModule.fetchAsync(targetFilePaths)

      if (!result) {
        // While testing the app I noticed that the FetchResultType of this function was empty. I am absolutely not sure
        // why this happened. As this cause an inconsistent state it is better to throw an error in this case.
        throw new Error('Fetch failed for some reason!')
      }

      return result
    } finally {
      FetcherModule.currentlyFetching = false
    }
  }
}

export default FetcherModule
