import AsyncStorage from '@react-native-async-storage/async-storage'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { JPAL_TRACKING_ROUTE, JpalTrackingRouteType } from 'api-client'

import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import appSettings from '../../utils/AppSettings'
import JpalTracking from '../JpalTracking'

jest.mock('react-i18next')
jest.mock('../../components/SettingsSwitch', () => {
  const { Text } = require('react-native')
  return () => <Text>SettingsSwitch</Text>
})

describe('JpalTracking', () => {
  beforeEach(() => {
    AsyncStorage.clear()
    jest.clearAllMocks()
  })

  const navigation = createNavigationMock<JpalTrackingRouteType>()
  const route = {
    key: 'route-id-0',
    name: JPAL_TRACKING_ROUTE,
    params: {},
  }

  it('should persist tracking enabled', async () => {
    const oldSettings = await appSettings.loadSettings()
    expect(oldSettings.jpalTrackingEnabled).toBeNull()

    const { getByText } = render(<JpalTracking route={route} navigation={navigation} />)
    await waitFor(() => expect(getByText('tracking')).toBeTruthy())

    fireEvent.press(getByText('allowTracking'))

    const settings = await appSettings.loadSettings()
    expect(settings.jpalTrackingEnabled).toBe(true)

    fireEvent.press(getByText('allowTracking'))

    const newSettings = await appSettings.loadSettings()
    expect(newSettings.jpalTrackingEnabled).toBe(false)
  })
})
