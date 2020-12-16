// @flow

import * as React from 'react'
import { render } from '@testing-library/react-native'
import AsyncStorage from '@react-native-community/async-storage'
import RootNavigator from '../RootNavigator'
import AppSettings from '../../../settings/AppSettings'
import waitForExpect from 'wait-for-expect'

jest.mock('@react-native-community/async-storage')

let mockCreateAppNavigationContainer: JestMockFn<*, *>
jest.mock('../../createAppContainer', () => {
  mockCreateAppNavigationContainer = jest.fn(({ initialRouteName }) => {
    const Text = require('react-native').Text
    return () => <Text>AppContainerOf({initialRouteName})</Text>
  })
  return mockCreateAppNavigationContainer
})

describe('RootNavigator', () => {
  beforeEach(() => {
    AsyncStorage.clear()
    jest.clearAllMocks()
  })

  it('should fetch cities on mount', async () => {
    const mock = jest.fn()
    const appSettings = new AppSettings()
    await appSettings.setContentLanguage('de')
    render(<RootNavigator fetchCities={mock} fetchCategory={() => {}} clearCategory={() => {}} />)
    await waitForExpect(() => {
      expect(mock).toHaveBeenCalledTimes(1)
    })
  })

  it('should display CityContent and call fetchCategory if a city is selected and the intro was shown', async () => {
    const appSettings = new AppSettings()
    await appSettings.setSelectedCity('augsburg')
    await appSettings.setContentLanguage('de')
    await appSettings.setIntroShown()
    const clearCategory = jest.fn()
    const fetchCategory = jest.fn()

    const { getByText } = render(<RootNavigator fetchCities={() => {}} fetchCategory={fetchCategory}
                                                clearCategory={clearCategory} />)
    await waitForExpect(() => {
      expect(mockCreateAppNavigationContainer).toHaveBeenCalledTimes(1)
      expect(mockCreateAppNavigationContainer).toHaveBeenCalledWith({
        initialRouteName: 'CityContent',
        cityCode: 'augsburg',
        clearCategory,
        language: 'de',
        key: expect.any(String)
      })
      expect(getByText('AppContainerOf(CityContent)')).toBeTruthy()
      const key = mockCreateAppNavigationContainer.mock.calls[0][0].key
      expect(fetchCategory).toHaveBeenCalledWith('augsburg', 'de', key)
    })
  })

  it('should display Landing if no city is selected in settings and intro was shown', async () => {
    const appSettings = new AppSettings()
    await appSettings.clearSelectedCity()
    await appSettings.setContentLanguage('de')
    await appSettings.setIntroShown()

    const { getByText } = render(<RootNavigator fetchCities={() => {}} fetchCategory={() => {}} clearCategory={() => {}} />)
    await waitForExpect(() => {
      expect(mockCreateAppNavigationContainer).toHaveBeenCalledTimes(1)
      expect(mockCreateAppNavigationContainer).toHaveBeenCalledWith({ initialRouteName: 'Landing' })
      expect(getByText('AppContainerOf(Landing)')).toBeTruthy()
    })
  })

  it('should display Intro if intro was not shown yet', async () => {
    const appSettings = new AppSettings()
    await appSettings.setContentLanguage('de')

    const { getByText } = render(<RootNavigator fetchCities={() => {}} fetchCategory={() => {}} clearCategory={() => {}} />)
    await waitForExpect(() => {
      expect(mockCreateAppNavigationContainer).toHaveBeenCalledTimes(1)
      expect(mockCreateAppNavigationContainer).toHaveBeenCalledWith({ initialRouteName: 'Intro' })
      expect(getByText('AppContainerOf(Intro)')).toBeTruthy()
    })
  })

  it('should display error, if content language could not be loaded', async () => {
    const { getByText } = render(<RootNavigator fetchCities={() => {}} fetchCategory={() => {}} clearCategory={() => {}} />)
    await waitForExpect(() => {
      expect(getByText('The contentLanguage has not been set correctly by I18nProvider!')).toBeTruthy()
    })
  })
})
