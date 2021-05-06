// @flow

import sendTrackingSignal, { sendRequest, setSystemLanguage } from '../sendTrackingSignal'
import { DASHBOARD_ROUTE, FetchError, OPEN_PAGE_SIGNAL_NAME } from 'api-client'
import AppSettings from '../../settings/AppSettings'
import buildConfig from '../../app/constants/buildConfig'
import AsyncStorage from '@react-native-community/async-storage'
import * as Sentry from '@sentry/react-native'

let mockRequest
jest.mock('api-client', () => {
  const mock = jest.fn()
  mockRequest = mock
  return {
    ...jest.requireActual('api-client'),
    createTrackingEndpoint: jest.fn(() => ({ request: mock }))
  }
})
jest.mock('moment', () => () => ({ toISOString: () => '2020-01-20T00:00:00.000Z' }))
jest.mock('@sentry/react-native')

describe('sendTrackingSignal', () => {
  beforeEach(() => {
    AsyncStorage.clear()
    jest.clearAllMocks()
  })

  const specificSignal = { name: OPEN_PAGE_SIGNAL_NAME, pageType: DASHBOARD_ROUTE, url: 'https://example.com' }

  describe('sendCompleteSignal', () => {
    const signal = {
      ...specificSignal,
      trackingCode: 'abcdef123456',
      offline: false,
      currentCity: 'muenchen',
      currentLanguage: 'ar',
      systemLanguage: 'kmr',
      appSettings: {
        allowPushNotifications: true,
        errorTracking: false
      },
      timestamp: '2020-01-20T00:00:00.000Z'
    }

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
        errorTracking: false
      })
    setSystemLanguage('kmr')

      await sendRequest(signal)
      expect(mockRequest).toHaveBeenCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledWith(signal)
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
        errorTracking: false
      })

      await sendRequest(signal)
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
        errorTracking: false
      })

      await sendRequest(signal)
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
        errorTracking: false
      })

      await sendRequest(signal)
      expect(mockRequest).not.toHaveBeenCalled()
    })

    it('should push signal to app settings if user is offline', async () => {
      // $FlowFixMe flow is not aware that buildConfig is a mock function
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { jpalTracking: true } }))

      const appSettings = new AppSettings()
      await appSettings.setSettings({
        jpalTrackingEnabled: true,
        jpalTrackingCode: 'abcdef123456',
        selectedCity: 'muenchen',
        contentLanguage: 'ar',
        allowPushNotifications: true,
        errorTracking: false
      })

      const error = new FetchError({ endpointName: 'endpoint', innerError: new Error('Internet kaputt') })
      mockRequest.mockRejectedValueOnce(error)

      await sendRequest(signal)

      const offlineSignals = await appSettings.clearJpalSignals()
      expect(offlineSignals).toEqual([{ ...signal, offline: true }])
    })

    it('should report error to sentry if an error occurs', async () => {
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
        jpalSignals: []
      })

      const error = new Error('Something bad happened and tracking does not work anymore!')
      mockRequest.mockRejectedValueOnce(error)

      await sendRequest(signal)

      const offlineSignals = await appSettings.clearJpalSignals()
      expect(offlineSignals).toEqual([])
      expect(Sentry.captureException).toHaveBeenCalledTimes(1)
      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })
  })

  describe('sendSpecificSignal', () => {
    it('should send correct signal', async () => {
      // $FlowFixMe flow is not aware that buildConfig is a mock function
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { jpalTracking: true } }))

      const appSettings = new AppSettings()
      await appSettings.setSettings({
        jpalTrackingEnabled: true,
        jpalTrackingCode: 'abcdef123456',
        selectedCity: 'muenchen',
        contentLanguage: 'ar',
        allowPushNotifications: true,
        errorTracking: false
      })

      await sendTrackingSignal({ signal: specificSignal, offline: true })
      expect(mockRequest).toHaveBeenCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledWith({
        ...specificSignal,
        trackingCode: 'abcdef123456',
        offline: true,
        currentCity: 'muenchen',
        currentLanguage: 'ar',
        systemLanguage: '', // TODO IGAPP-566 Include system language
        appSettings: {
          allowPushNotifications: true,
          errorTracking: false
        },
        timestamp: '2020-01-20T00:00:00.000Z'
      })
    })
  })
})
