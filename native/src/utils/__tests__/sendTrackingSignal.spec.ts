import AsyncStorage from '@react-native-async-storage/async-storage'
import { mocked } from 'jest-mock'

import { createTrackingEndpoint, CATEGORIES_ROUTE, FetchError, OPEN_PAGE_SIGNAL_NAME } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import appSettings from '../AppSettings'
import sendTrackingSignal, { sendRequest, setSystemLanguage } from '../sendTrackingSignal'
import { reportError } from '../sentry'

jest.mock('../sentry')
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  createTrackingEndpoint: jest.fn(() => ({
    request: jest.fn(),
  })),
}))
jest.mock('moment', () => () => ({
  toISOString: () => '2020-01-20T00:00:00.000Z',
}))
jest.mock('@sentry/react-native')

describe('sendTrackingSignal', () => {
  const mockRequest = jest.fn()
  const mockCreateTrackingEndpoint = mocked(createTrackingEndpoint)
  const mockedBuildConfig = mocked(buildConfig)

  const mockBuildConfig = (jpalTracking: boolean) => {
    const previous = buildConfig()
    mockedBuildConfig.mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, jpalTracking },
    }))
  }

  beforeEach(() => {
    AsyncStorage.clear()
    jest.clearAllMocks()
    mockCreateTrackingEndpoint.mockImplementation(() => ({ request: mockRequest }))
  })

  const specificSignal = {
    name: OPEN_PAGE_SIGNAL_NAME,
    pageType: CATEGORIES_ROUTE,
    url: 'https://example.com',
  }

  describe('sendRequest', () => {
    const signal = {
      ...specificSignal,
      trackingCode: 'abcdef123456',
      offline: false,
      currentCity: 'muenchen',
      currentLanguage: 'ar',
      systemLanguage: 'kmr',
      appSettings: {
        allowPushNotifications: true,
        errorTracking: false,
      },
      timestamp: '2020-01-20T00:00:00.000Z',
    }

    it('should request the tracking endpoint if tracking enabled and tracking code set', async () => {
      mockBuildConfig(true)
      await appSettings.setSettings({
        jpalTrackingEnabled: true,
        jpalTrackingCode: 'abcdef123456',
        selectedCity: 'muenchen',
        contentLanguage: 'ar',
        allowPushNotifications: true,
        errorTracking: false,
      })
      setSystemLanguage('kmr')
      await sendRequest(signal)
      expect(mockRequest).toHaveBeenCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledWith(signal)
    })

    it('should not send a signal if disabled in build config', async () => {
      mockBuildConfig(false)
      await appSettings.setSettings({
        jpalTrackingEnabled: true,
        jpalTrackingCode: 'abcdef123456',
        selectedCity: 'muenchen',
        contentLanguage: 'ar',
        allowPushNotifications: true,
        errorTracking: false,
      })
      await sendRequest(signal)
      expect(mockRequest).not.toHaveBeenCalled()
    })
    it('should not send a signal if disabled in app settings', async () => {
      mockBuildConfig(true)
      await appSettings.setSettings({
        jpalTrackingEnabled: false,
        jpalTrackingCode: 'abcdef123456',
        selectedCity: 'muenchen',
        contentLanguage: 'ar',
        allowPushNotifications: true,
        errorTracking: false,
      })
      await sendRequest(signal)
      expect(mockRequest).not.toHaveBeenCalled()
    })

    it('should not send a signal if no tracking code set', async () => {
      mockBuildConfig(true)
      await appSettings.setSettings({
        jpalTrackingEnabled: true,
        jpalTrackingCode: null,
        selectedCity: 'muenchen',
        contentLanguage: 'ar',
        allowPushNotifications: true,
        errorTracking: false,
      })
      await sendRequest(signal)
      expect(mockRequest).not.toHaveBeenCalled()
    })

    it('should push signal to app settings if user is offline', async () => {
      mockBuildConfig(true)
      await appSettings.setSettings({
        jpalTrackingEnabled: true,
        jpalTrackingCode: 'abcdef123456',
        selectedCity: 'muenchen',
        contentLanguage: 'ar',
        allowPushNotifications: true,
        errorTracking: false,
      })
      const error = new FetchError({
        endpointName: 'endpoint',
        innerError: new Error('Internet kaputt'),
        url: 'url',
        requestOptions: { method: 'POST' },
      })
      mockRequest.mockRejectedValueOnce(error)
      await sendRequest(signal)
      const offlineSignals = await appSettings.clearJpalSignals()
      expect(offlineSignals).toEqual([{ ...signal, offline: true }])
    })

    it('should report error to sentry if an error occurs', async () => {
      mockBuildConfig(true)
      await appSettings.setSettings({
        jpalTrackingEnabled: true,
        jpalTrackingCode: 'abcdef123456',
        selectedCity: 'muenchen',
        contentLanguage: 'ar',
        allowPushNotifications: true,
        errorTracking: false,
        jpalSignals: [],
      })
      const error = new Error('Something bad happened and tracking does not work anymore!')
      mockRequest.mockRejectedValueOnce(error)
      await sendRequest(signal)
      const offlineSignals = await appSettings.clearJpalSignals()
      expect(offlineSignals).toEqual([])
      expect(reportError).toHaveBeenCalledTimes(1)
      expect(reportError).toHaveBeenCalledWith(error)
    })
  })

  describe('sendTrackingSignal', () => {
    it('should send correct signal', async () => {
      mockBuildConfig(true)
      await appSettings.setSettings({
        jpalTrackingEnabled: true,
        jpalTrackingCode: 'abcdef123456',
        selectedCity: 'muenchen',
        contentLanguage: 'ar',
        allowPushNotifications: true,
        errorTracking: false,
      })
      setSystemLanguage('ar')
      await sendTrackingSignal({
        signal: specificSignal,
        offline: true,
      })
      expect(mockRequest).toHaveBeenCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledWith({
        ...specificSignal,
        trackingCode: 'abcdef123456',
        offline: true,
        currentCity: 'muenchen',
        currentLanguage: 'ar',
        systemLanguage: 'ar',
        appSettings: {
          allowPushNotifications: true,
          errorTracking: false,
        },
        timestamp: '2020-01-20T00:00:00.000Z',
      })
    })
  })
})
