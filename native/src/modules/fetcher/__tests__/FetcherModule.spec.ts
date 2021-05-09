// @flow

import type { TargetFilePathsType } from '../FetcherModule'
import FetcherModule from '../FetcherModule'
import NativeFetcherModule from '../NativeFetcherModule'

jest.mock('../NativeFetcherModule')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('FetcherModule', () => {
  let fetcherModule: FetcherModule
  beforeEach(() => {
    fetcherModule = new FetcherModule()
  })

  describe('createProgressChannel', () => {
    it('should create event channel', () => {
      const channel = fetcherModule.createProgressChannel()
      expect(NativeFetcherModule.addListener).toHaveBeenCalledWith('progress')
      channel.close()
    })
  })

  describe('fetchAsync', () => {
    const testTargetFilePaths: TargetFilePathsType = {
      'local/path/to/resource.png': 'http://randomtesturl.de/resource.png',
      'local/path/to/resource2.jpg': 'http://randomtesturl.de/resource2.jpg'
    }

    it('should call fetchAsync with targetFiles on native module', async () => {
      await fetcherModule.fetchAsync(testTargetFilePaths)
      expect(NativeFetcherModule.fetchAsync).toHaveBeenCalledTimes(1)
      expect(NativeFetcherModule.fetchAsync).toHaveBeenCalledWith(testTargetFilePaths)
    })

    it('should not call fetchAsync if targetFiles are empty', async () => {
      await fetcherModule.fetchAsync({})
      expect(NativeFetcherModule.fetchAsync).not.toHaveBeenCalled()
    })

    it('should set currentlyFetching to true if fetcher is already busy', async () => {
      const fetcherModule = new FetcherModule()

      expect(FetcherModule.currentlyFetching).toBe(false)
      fetcherModule.fetchAsync(testTargetFilePaths)
      expect(FetcherModule.currentlyFetching).toBe(true)
    })

    it('should return the fetch result data if fetchAsync call is valid', async () => {
      const fetchResult = await fetcherModule.fetchAsync(testTargetFilePaths)
      expect(fetchResult).toMatchSnapshot()
    })
  })
})
