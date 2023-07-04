import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { mocked } from 'jest-mock'
import React from 'react'

import { CityModelBuilder, ReturnType, useLoadAsync } from 'api-client'

import Navigator from '../Navigator'
import { AppContext } from '../contexts/AppContextProvider'
import render from '../testing/render'
import { defaultSettings, SettingsType } from '../utils/AppSettings'
import dataContainer from '../utils/DefaultDataContainer'
import { quitAppStatePushNotificationListener } from '../utils/PushNotificationsManager'

const cities = new CityModelBuilder(3).build()
jest.mock('styled-components')
jest.mock('../utils/DefaultDataContainer', () => ({ deleteCity: jest.fn(async () => undefined) }))
jest.mock('@react-native-community/netinfo')
jest.mock('../hooks/useLoadCities', () => jest.fn(() => ({ data: cities, error: null })))
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadAsync: jest.fn(() => ({ data: null, error: null })),
}))
jest.mock('../utils/sentry')
jest.mock('react-native/Libraries/Utilities/useWindowDimensions')
jest.mock('react-i18next')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('../routes/Intro', () => {
  const { Text } = require('react-native')

  return () => <Text>Intro</Text>
})
jest.mock('../components/RedirectContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Redirect</Text>
})
jest.mock('../routes/Landing', () => {
  const { Text } = require('react-native')

  return () => <Text>Landing</Text>
})
jest.mock('../routes/Settings', () => {
  const { Text } = require('react-native')

  return () => <Text>Settings</Text>
})
jest.mock('../routes/CategoriesContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Categories</Text>
})
jest.mock('../routes/EventsContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Events</Text>
})
jest.mock('../routes/PoisContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Pois</Text>
})
jest.mock('../routes/NewsContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>News</Text>
})
jest.mock('../routes/ChangeLanguageModal', () => {
  const { Text } = require('react-native')

  return () => <Text>ChangeLanguage</Text>
})
jest.mock('../routes/FeedbackModalContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Feedback</Text>
})
jest.mock('../routes/OffersContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Offers</Text>
})
jest.mock('../routes/SprungbrettOfferContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>SprungbrettOffer</Text>
})
jest.mock('../routes/ExternalOfferContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>ExternalOffer</Text>
})
jest.mock('../routes/SearchModalContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Search</Text>
})
jest.mock('../routes/PDFViewModal', () => {
  const { Text } = require('react-native')

  return () => <Text>PdfView</Text>
})
jest.mock('../routes/ImageViewModal', () => {
  const { Text } = require('react-native')

  return () => <Text>ImageView</Text>
})
jest.mock('../components/Header', () => {
  const { Text } = require('react-native')

  return () => <Text>Header</Text>
})
jest.mock('../components/TransparentHeader', () => {
  const { Text } = require('react-native')

  return () => <Text>TransparentHeader</Text>
})
jest.mock('../utils/PushNotificationsManager', () => ({
  pushNotificationsSupported: jest.fn(() => true),
  quitAppStatePushNotificationListener: jest.fn(),
  useForegroundPushNotificationListener: jest.fn(),
}))
jest.mock('../utils/FetcherModule')

const changeCityCode = jest.fn()
const renderNavigator = (cityCode: string | null = null) =>
  render(
    <AppContext.Provider value={{ changeCityCode, changeLanguageCode: jest.fn(), cityCode, languageCode: 'de' }}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </AppContext.Provider>
  )

describe('Navigator', () => {
  beforeEach(() => {
    AsyncStorage.clear()
    jest.clearAllMocks()
  })

  const mockSettings = (settings: Partial<SettingsType>) =>
    mocked<(_: never) => ReturnType<SettingsType>>(useLoadAsync).mockImplementation(() => ({
      data: { ...defaultSettings, ...settings },
      error: null,
      loading: false,
      refresh: jest.fn(),
    }))

  it('should display categories if a city is selected and the intro was shown', async () => {
    mockSettings({ introShown: true })
    const { findByText } = renderNavigator('augsburg')
    await findByText('Categories')
  })

  it('should display landing if the selected city is not available anymore', async () => {
    mockSettings({ introShown: true })
    const { findByText } = renderNavigator('disabledCity')
    await findByText('Landing')
    expect(changeCityCode).toHaveBeenCalledTimes(1)
    expect(changeCityCode).toHaveBeenCalledWith(null)
    expect(dataContainer.deleteCity).toHaveBeenCalledTimes(1)
    expect(dataContainer.deleteCity).toHaveBeenCalledWith('disabledCity')
  })

  it('should display Landing if no city is selected in settings and intro was shown', async () => {
    mockSettings({ introShown: true })
    const { findByText } = renderNavigator()
    await findByText('Landing')
  })

  it('should display Intro if intro was not shown yet', async () => {
    mockSettings({ introShown: false })
    const { findByText } = renderNavigator()
    await findByText('Intro')
  })

  it('should listen for push notification press in quit state', async () => {
    mockSettings({ introShown: true })
    mocked(quitAppStatePushNotificationListener).mockImplementation(async navigate =>
      navigate('https://integreat.app/augsbug/de/news/local/1234')
    )
    const { findByText } = renderNavigator()

    await findByText('Redirect')
    expect(quitAppStatePushNotificationListener).toHaveBeenCalledTimes(1)
  })
})
