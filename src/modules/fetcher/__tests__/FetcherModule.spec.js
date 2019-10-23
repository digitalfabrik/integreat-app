// @flow

import FetcherModule from '../FetcherModule'
import NativeFetcherModule from '../NativeFetcherModule'
import type { TargetFilePathsType } from '../FetcherModule'

jest.mock('../NativeFetcherModule')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('FetcherModule', () => {
  const testTargetFilePaths: TargetFilePathsType = {
    'local/path/to/resource.png': 'http://randomtesturl.de/resource.png',
    'local/path/to/resource2.jpg': 'http://randomtesturl.de/resource2.jpg'
  }

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
    const anotherFetcherModule = new FetcherModule()

    fetcherModule.fetchAsync(testTargetFilePaths, process => console.log(process))

    expect.assertions(1)
    try {
      await anotherFetcherModule.fetchAsync(testTargetFilePaths, process => console.log(process))
    } catch (e) {
      expect(e).toEqual(new Error('Already fetching!'))
    }
  })

  it('should return the fetch result data if fetchAsync call is valid', async () => {
    const fetcherModule = new FetcherModule()
    const fetchResult = await fetcherModule.fetchAsync(testTargetFilePaths, progress => console.log(progress))
    expect(fetchResult).toMatchSnapshot()
  })
})
