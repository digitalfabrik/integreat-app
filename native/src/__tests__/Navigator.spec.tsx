import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { RegionModelBuilder } from 'shared/api'

import Navigator from '../Navigator'
import useLoadRegionContent, { RegionContentReturn } from '../hooks/useLoadRegionContent'
import TestingAppContext from '../testing/TestingAppContext'
import render from '../testing/render'
import dataContainer from '../utils/DefaultDataContainer'

const regions = new RegionModelBuilder(3).build()
jest.mock('styled-components')
jest.mock('../utils/DefaultDataContainer', () => ({ deleteRegion: jest.fn(async () => undefined) }))
jest.mock('@react-native-community/netinfo')
jest.mock('../hooks/useLoadRegions', () => jest.fn(() => ({ data: regions, error: null })))
jest.mock('../hooks/useLoadRegionContent')
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
jest.mock('../routes/SearchContainer', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>Search</Text>
})
jest.mock('../routes/SuggestToRegion', () => {
  const { Text } = require('react-native-paper')

  return () => <Text>SuggestToRegion</Text>
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

const changeRegionCode = jest.fn()
const renderNavigator = ({
  regionCode = null,
  introShown = null,
}: {
  regionCode?: string | null
  introShown?: boolean | null
}) =>
  render(
    <TestingAppContext changeRegionCode={changeRegionCode} regionCode={regionCode} settings={{ introShown }}>
      <Navigator />
    </TestingAppContext>,
  )

describe('Navigator', () => {
  const { mocked } = jest
  beforeEach(() => {
    jest.clearAllMocks()
    mocked(useLoadRegionContent).mockReturnValue({
      data: {
        region: regions[0]!,
        languages: [],
        regions,
        language: null as never,
        categories: null as never,
        events: [],
        pois: [],
        localNews: [],
      },
      loading: false,
      error: null,
      refresh: jest.fn(),
    } as RegionContentReturn)
  })

  it('should start with categories as the initial tab', async () => {
    const { findByText } = renderNavigator({ regionCode: 'augsburg', introShown: true })

    // default tab of the bottom tab navigator - shows Categories screen
    await findByText('Categories')

    // verify bottom tab navigator is mounted by checking for tab labels
    await findByText('localInformationLabel')
    await findByText('news')
    await findByText('events')
  })

  it('should allow switching between all bottom tabs', async () => {
    const { findByText, getByText } = renderNavigator({ regionCode: 'augsburg', introShown: true })

    fireEvent.press(getByText('events'))
    await findByText('Events')

    fireEvent.press(getByText('localInformationLabel'))
    await findByText('Categories')

    fireEvent.press(getByText('news'))
    await findByText('News')
  })

  it('should display landing if the selected region is not available anymore', async () => {
    const { findByText } = renderNavigator({ regionCode: 'disabledRegion', introShown: true })
    await findByText('Landing')
    expect(changeRegionCode).toHaveBeenCalledTimes(1)
    expect(changeRegionCode).toHaveBeenCalledWith(null)
    expect(dataContainer.deleteRegion).toHaveBeenCalledTimes(1)
    expect(dataContainer.deleteRegion).toHaveBeenCalledWith('disabledRegion')
  })

  it('should display Landing if no region is selected in settings and intro was shown', async () => {
    const { findByText } = renderNavigator({ introShown: true })
    await findByText('Landing')
  })

  it('should display Intro if intro was not shown yet', async () => {
    const { findByText } = renderNavigator({ introShown: false })
    await findByText('Intro')
  })
})
