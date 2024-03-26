import { isEmpty } from 'lodash'

import NativeFetcherModule from './NativeFetcherModule'

export type TargetFilePathsType = Record<string, string>
export type FetchResultType = Record<string, { url: string; errorMessage: string | null | undefined }>

class FetcherModule {
  static currentlyFetching = false

  async fetchAsync(targetFilePaths: TargetFilePathsType): Promise<FetchResultType> {
    if (isEmpty(targetFilePaths)) {
      return {}
    }

    FetcherModule.currentlyFetching = true

    try {
      const result: FetchResultType | null | undefined = await NativeFetcherModule.fetchAsync(targetFilePaths)

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
