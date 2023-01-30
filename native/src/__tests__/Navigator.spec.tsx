import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { render } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import Navigator from '../Navigator'
import { AppContext } from '../contexts/AppContextProvider'
import useLoadCities from '../hooks/useLoadCities'
import appSettings from '../utils/AppSettings'
import { quitAppStatePushNotificationListener } from '../utils/PushNotificationsManager'

jest.mock('@react-native-community/netinfo')
jest.mock('../hooks/useLoadCities')
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
jest.mock('../components/SettingsHeader', () => {
  const { Text } = require('react-native')

  return () => <Text>SettingsHeader</Text>
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

const renderNavigator = (cityCode: string | null = null) =>
  render(
    <AppContext.Provider
      value={{ changeCityCode: jest.fn(), changeLanguageCode: jest.fn(), cityCode, languageCode: 'de' }}>
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

  it('should preload cities', async () => {
    const { findByText } = renderNavigator()

    await findByText('Intro')
    expect(useLoadCities).toHaveBeenCalled()
  })

  it('should display categories if a city is selected and the intro was shown', async () => {
    await appSettings.setIntroShown()
    const { findByText } = renderNavigator('augsburg')
    await findByText('Categories')
  })

  it('should display Landing if no city is selected in settings and intro was shown', async () => {
    await appSettings.clearSelectedCity()
    await appSettings.setIntroShown()
    const { findByText } = renderNavigator()
    await findByText('Landing')
  })

  it('should display Intro if intro was not shown yet', async () => {
    const { findByText } = renderNavigator()
    await findByText('Intro')
  })

  it('should listen for push notification press in quit state', async () => {
    mocked(quitAppStatePushNotificationListener).mockImplementation(async navigate =>
      navigate('https://integreat.app/augsbug/de/news/local/1234')
    )
    await appSettings.setIntroShown()
    const { findByText } = renderNavigator()

    await findByText('Redirect')
    expect(quitAppStatePushNotificationListener).toHaveBeenCalledTimes(1)
  })
})
