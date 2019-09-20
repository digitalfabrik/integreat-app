// @flow

import FetcherModule from '../FetcherModule'
import NativeFetcherModule from '../NativeFetcherModule'
import type { TargetFilePathsType } from '../FetcherModule'

jest.mock('../NativeFetcherModule')

beforeEach(() => {
  jest.resetAllMocks()
})

describe('FetcherModule', () => {
  const testTargetFilePaths: TargetFilePathsType = {
    'local/path/to/resource.png': 'http://randomtesturl.de/resource.png',
    'local/path/to/resource2.jpg': 'http://randomtesturl.de/resource2.jpg'
  }

  it('currentlyFetching should be false if no fetching process is running', () => {
    expect(FetcherModule.currentlyFetching).toBe(false)
  })
  it('should call fetchAsync with targetFiles on native module', async () => {
    const fetcherModule = new FetcherModule()
    await fetcherModule.fetchAsync(testTargetFilePaths, progress => console.log(progress))
    expect(NativeFetcherModule.fetchAsync).toHaveBeenCalledTimes(1)
    expect(NativeFetcherModule.fetchAsync).toHaveBeenCalledWith(testTargetFilePaths)
  })
  it('should not call fetchAsync if targetFiles are empty', async () => {
    const fetcherModule = new FetcherModule()
    await fetcherModule.fetchAsync({}, progress => console.log(progress))
    expect(NativeFetcherModule.fetchAsync).not.toHaveBeenCalled()
  })
  it('should return an error if fetcher is already busy', async () => {
    const fetcherModule = new FetcherModule()
    FetcherModule.currentlyFetching = true
    expect(fetcherModule.fetchAsync(testTargetFilePaths, progress => console.log(progress)))
      .rejects.toEqual({
        error: 'Already fetching!'
      })
    FetcherModule.currentlyFetching = false
  })
})
