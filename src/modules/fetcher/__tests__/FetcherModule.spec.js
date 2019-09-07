// @flow

import FetcherModule from '../FetcherModule'

jest.mock('NativeModules')

describe('FetcherModule', () => {
  it('currentlyFetching should be false if no fetching process is running', () => {
    expect(FetcherModule.currentlyFetching).toBe(false)
  })
})
