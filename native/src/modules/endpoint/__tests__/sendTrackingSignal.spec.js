// @flow

import sendTrackingSignal from '../sendTrackingSignal'
import { DASHBOARD_ROUTE, OPEN_PAGE_SIGNAL_NAME } from 'api-client'
import AppSettings from '../../settings/AppSettings'
import buildConfig from '../../app/constants/buildConfig'
import AsyncStorage from '@react-native-community/async-storage'

let mockRequest
jest.mock('api-client', () => {
  const mock = jest.fn()
  mockRequest = mock
  return {
    createTrackingEndpoint: jest.fn(() => ({ request: mock }))
  }
})
jest.mock('moment', () => () => ({ toISOString: () => '2020-01-20T00:00:00.000Z' }))

describe('sendTrackingSignal', () => {
  beforeEach(() => {
    AsyncStorage.clear()
    jest.clearAllMocks()
  })

  const signal = { name: OPEN_PAGE_SIGNAL_NAME, pageType: DASHBOARD_ROUTE, url: 'https://example.com' }

  it('should request the tracking endpoint if tracking enabled and tracking code set', async () => {
    // $FlowFixMe flow is not aware that buildConfig is a mock function
    buildConfig.mockImplementationOnce(() => ({ featureFlags: { jpalTracking: true } }))

    const appSettings = new AppSettings()
    await appSettings.setSettings({
      jpalTrackingEnabled: true,
      jpalTrackingCode: 'abcdef123456',
      selectedCity: 'muenchen',
      contentLanguage: 'ar',
      allowPushNotifications: true,
      errorTracking: false,
      proposeNearbyCities: false
    })

    await sendTrackingSignal({ signal, offline: true })
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      ...signal,
      trackingCode: 'abcdef123456',
      offline: true,
      currentCity: 'muenchen',
      currentLanguage: 'ar',
      systemLanguage: '', // TODO IGAPP-566 Include system language
      appSettings: {
        allowPushNotifications: true,
        errorTracking: false,
        proposeNearbyCities: false
      },
      timestamp: '2020-01-20T00:00:00.000Z'
    })
  })

  it('should not send a signal if disabled in build config', async () => {
    // $FlowFixMe flow is not aware that buildConfig is a mock function
    buildConfig.mockImplementationOnce(() => ({ featureFlags: { jpalTracking: false } }))

    const appSettings = new AppSettings()
    await appSettings.setSettings({
      jpalTrackingEnabled: true,
      jpalTrackingCode: 'abcdef123456',
      selectedCity: 'muenchen',
      contentLanguage: 'ar',
      allowPushNotifications: true,
      errorTracking: false,
      proposeNearbyCities: false
    })

    await sendTrackingSignal({ signal, offline: true })
    expect(mockRequest).not.toHaveBeenCalled()
  })

  it('should not send a signal if disabled in app settings', async () => {
    // $FlowFixMe flow is not aware that buildConfig is a mock function
    buildConfig.mockImplementationOnce(() => ({ featureFlags: { jpalTracking: true } }))

    const appSettings = new AppSettings()
    await appSettings.setSettings({
      jpalTrackingEnabled: false,
      jpalTrackingCode: 'abcdef123456',
      selectedCity: 'muenchen',
      contentLanguage: 'ar',
      allowPushNotifications: true,
      errorTracking: false,
      proposeNearbyCities: false
    })

    await sendTrackingSignal({ signal, offline: true })
    expect(mockRequest).not.toHaveBeenCalled()
  })

  it('should not send a signal if no tracking code set', async () => {
    // $FlowFixMe flow is not aware that buildConfig is a mock function
    buildConfig.mockImplementationOnce(() => ({ featureFlags: { jpalTracking: true } }))

    const appSettings = new AppSettings()
    await appSettings.setSettings({
      jpalTrackingEnabled: true,
      jpalTrackingCode: null,
      selectedCity: 'muenchen',
      contentLanguage: 'ar',
      allowPushNotifications: true,
      errorTracking: false,
      proposeNearbyCities: false
    })

    await sendTrackingSignal({ signal, offline: true })
    expect(mockRequest).not.toHaveBeenCalled()
  })
})
