import React from 'react'

import { CityModelBuilder } from 'shared/api'

import Navigator from '../Navigator'
import TestingAppContext from '../testing/TestingAppContext'
import render from '../testing/render'
import dataContainer from '../utils/DefaultDataContainer'
import { usePushNotificationListener } from '../utils/PushNotificationsManager'

const cities = new CityModelBuilder(3).build()
jest.mock('styled-components')
jest.mock('../utils/DefaultDataContainer', () => ({ deleteCity: jest.fn(async () => undefined) }))
jest.mock('@react-native-community/netinfo')
jest.mock('../hooks/useLoadCities', () => jest.fn(() => ({ data: cities, error: null })))
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadAsync: jest.fn(() => ({ data: null, error: null })),
}))
jest.mock('../utils/sentry')
jest.mock('react-native/Libraries/Utilities/useWindowDimensions')
jest.mock('react-i18next')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('../routes/Intro', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>Intro</Text>
})
jest.mock('../components/RedirectContainer', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>Redirect</Text>
})
jest.mock('../routes/Landing', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>Landing</Text>
})
jest.mock('../routes/Settings', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>Settings</Text>
})
jest.mock('../routes/CategoriesContainer', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>Categories</Text>
})
jest.mock('../routes/EventsContainer', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>Events</Text>
})
jest.mock('../routes/PoisContainer', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>Pois</Text>
})
jest.mock('../routes/NewsContainer', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>News</Text>
})
jest.mock('../routes/ChangeLanguageModal', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>ChangeLanguage</Text>
})
jest.mock('../routes/FeedbackModalContainer', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>Feedback</Text>
})
jest.mock('../routes/SearchModalContainer', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>Search</Text>
})
jest.mock('../routes/CityNotCooperating', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>CityNotCooperating</Text>
})
jest.mock('../routes/PDFViewModal', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>PdfView</Text>
})
jest.mock('../routes/ImageViewModal', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>ImageView</Text>
})
jest.mock('../components/Header', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>Header</Text>
})
jest.mock('../components/TransparentHeader', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>TransparentHeader</Text>
})
jest.mock('../utils/PushNotificationsManager', () => ({
  usePushNotificationListener: jest.fn(() => undefined),
}))
jest.mock('../utils/FetcherModule')
jest.mock('../navigation/BottomTabNavigation')

const changeCityCode = jest.fn()
const renderNavigator = ({
  cityCode = null,
  introShown = null,
}: {
  cityCode?: string | null
  introShown?: boolean | null
}) =>
  render(
    <TestingAppContext changeCityCode={changeCityCode} cityCode={cityCode} settings={{ introShown }}>
      <Navigator />
    </TestingAppContext>,
  )

describe('Navigator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // TODO Check for a proper test that we reached the bottom navigation route
  it.skip('should display categories if a city is selected and the intro was shown', async () => {
    const { findByText } = renderNavigator({ cityCode: 'augsburg', introShown: true })
    await findByText('Categories')
  })

  it('should display landing if the selected city is not available anymore', async () => {
    const { findByText } = renderNavigator({ cityCode: 'disabledCity', introShown: true })
    await findByText('Landing')
    expect(changeCityCode).toHaveBeenCalledTimes(1)
    expect(changeCityCode).toHaveBeenCalledWith(null)
    expect(dataContainer.deleteCity).toHaveBeenCalledTimes(1)
    expect(dataContainer.deleteCity).toHaveBeenCalledWith('disabledCity')
  })

  it('should display Landing if no city is selected in settings and intro was shown', async () => {
    const { findByText } = renderNavigator({ introShown: true })
    await findByText('Landing')
  })

  it('should display Intro if intro was not shown yet', async () => {
    const { findByText } = renderNavigator({ introShown: false })
    await findByText('Intro')
  })

  it('should listen for push notifications', async () => {
    renderNavigator({ introShown: true })
    expect(usePushNotificationListener).toHaveBeenCalled()
  })
})
