// @flow

import AsyncStorage from '@react-native-community/async-storage'
import determineApiUrl from '../determineApiUrl'
import { baseUrl } from '../constants'
import { API_URL_OVERRIDE_KEY } from '../../settings/AppSettings'

jest.mock('@react-native-community/async-storage')

describe('determineApiUrl', () => {
  it('should return the default baseURL if no overrideApiUrl is set', async () => {
    const apiUrl = await determineApiUrl()
    expect(apiUrl).toEqual(baseUrl)
  })

  it('should return the overrideApiUrl if it is set', async () => {
    AsyncStorage.setItem(API_URL_OVERRIDE_KEY, 'https://super-cool-override-cms.url.com')
    const apiUrl = await determineApiUrl()
    expect(apiUrl).toEqual('https://super-cool-override-cms.url.com')
  })
})
