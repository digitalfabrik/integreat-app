// @flow

import determineApiUrl from '../determineApiUrl'
import { baseUrl } from '../constants'
import AppSettings from '../../settings/AppSettings'

jest.mock('@react-native-community/async-storage')

describe('determineApiUrl', () => {
  it('should return the default baseURL if no overrideApiUrl is set', async () => {
    const apiUrl = await determineApiUrl()
    expect(apiUrl).toEqual(baseUrl)
  })

  it('should return the overrideApiUrl if it is set', async () => {
    new AppSettings().setApiUrlOverride('https://super-cool-override-cms.url.com')
    const apiUrl = await determineApiUrl()
    expect(apiUrl).toEqual('https://super-cool-override-cms.url.com')
  })
})
