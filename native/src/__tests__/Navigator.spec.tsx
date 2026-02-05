import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { CityModelBuilder } from 'shared/api'

import Navigator from '../Navigator'
import useLoadCityContent, { CityContentReturn } from '../hooks/useLoadCityContent'
import TestingAppContext from '../testing/TestingAppContext'
import render from '../testing/render'
import dataContainer from '../utils/DefaultDataContainer'
import { usePushNotificationListener } from '../utils/PushNotificationsManager'

const cities = new CityModelBuilder(3).build()
jest.mock('styled-components')
jest.mock('../utils/DefaultDataContainer', () => ({ deleteCity: jest.fn(async () => undefined) }))
jest.mock('@react-native-community/netinfo')
jest.mock('../hooks/useLoadCities', () => jest.fn(() => ({ data: cities, error: null })))
jest.mock('../hooks/useLoadCityContent')
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadAsync: jest.fn(() => ({ data: null, error: null })),
}))
jest.mock('../utils/sentry')
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({ width: 1080, height: 2400 })),
}))
jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => ({
  __esModule: true,
  default: {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    dismiss: jest.fn(),
  },
}))
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
    mocked(useLoadCityContent).mockReturnValue({
      data: {
        city: cities[0]!,
        languages: [],
        cities,
        language: null as never,
        categories: null as never,
        events: [],
        pois: [],
        localNews: [],
      },
      loading: false,
      error: null,
      refresh: jest.fn(),
    } as CityContentReturn)
  })

  it('should start with categories as the initial tab', async () => {
    const { findByText } = renderNavigator({ cityCode: 'augsburg', introShown: true })

    // default tab of the bottom tab navigator - shows Categories screen
    await findByText('Categories')

    // verify bottom tab navigator is mounted by checking for tab labels
    await findByText('localInformationLabel')
    await findByText('news')
    await findByText('events')
  })

  it('should allow switching between all bottom tabs', async () => {
    const { findByText, getByText } = renderNavigator({ cityCode: 'augsburg', introShown: true })

    fireEvent.press(getByText('events'))
    await findByText('Events')

    fireEvent.press(getByText('localInformationLabel'))
    await findByText('Categories')

    fireEvent.press(getByText('news'))
    await findByText('News')
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
