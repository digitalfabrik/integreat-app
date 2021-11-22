import AsyncStorage from '@react-native-async-storage/async-storage'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { JPAL_TRACKING_ROUTE, JpalTrackingRouteType } from 'api-client'

import createNavigationMock from '../../testing/createNavigationPropMock'
import wrapWithTheme from '../../testing/wrapWithTheme'
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

  const trackingCode = '1234567'
  const navigation = createNavigationMock<JpalTrackingRouteType>()
  const route = (trackingCode: string | null = '1234567') => ({
    key: 'route-id-0',
    params: {
      trackingCode
    },
    name: JPAL_TRACKING_ROUTE
  })
  const defaultRoute = route()

  it('should persist route tracking code', async () => {
    const oldSettings = await appSettings.loadSettings()
    expect(oldSettings.jpalTrackingCode).toBeNull()
    const { getByText } = render(<JpalTracking route={route(trackingCode)} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
    await waitFor(() => expect(getByText('tracking')).toBeTruthy())
    const settings = await appSettings.loadSettings()
    await waitFor(() => expect(settings.jpalTrackingCode).toBe(trackingCode))
  })

  it('should not override tracking code if no code passed', async () => {
    await appSettings.setJpalTrackingCode(trackingCode)
    const oldSettings = await appSettings.loadSettings()
    expect(oldSettings.jpalTrackingCode).toBe(trackingCode)

    const { getByText } = render(<JpalTracking route={route(null)} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
    await waitFor(() => expect(getByText('tracking')).toBeTruthy())
    const settings = await appSettings.loadSettings()
    expect(settings.jpalTrackingCode).toBe(trackingCode)
  })

  it('should persist tracking enabled', async () => {
    const oldSettings = await appSettings.loadSettings()
    expect(oldSettings.jpalTrackingEnabled).toBeNull()

    const { getByText } = render(<JpalTracking route={defaultRoute} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
    await waitFor(() => expect(getByText('tracking')).toBeTruthy())

    fireEvent.press(getByText('allowTracking'))

    const settings = await appSettings.loadSettings()
    expect(settings.jpalTrackingEnabled).toBe(true)

    fireEvent.press(getByText('allowTracking'))

    const newSettings = await appSettings.loadSettings()
    expect(newSettings.jpalTrackingEnabled).toBe(false)
  })
})
