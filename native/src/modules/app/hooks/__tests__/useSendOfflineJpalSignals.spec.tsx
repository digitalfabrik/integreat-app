import AppSettings from '../../../settings/AppSettings'
import { CATEGORIES_ROUTE, DASHBOARD_ROUTE, OPEN_PAGE_SIGNAL_NAME } from 'api-client'
import React from 'react'
import useSendOfflineJpalSignals from '../useSendOfflineJpalSignals'
import { render, waitFor } from '@testing-library/react-native'
import { sendRequest } from '../../../endpoint/sendTrackingSignal'

let mockUseNetInfo
jest.mock('@react-native-community/netinfo', () => {
  const mock = jest.fn()
  mockUseNetInfo = mock
  return {
    useNetInfo: mock
  }
})
jest.mock('../../../endpoint/sendTrackingSignal')
describe('useSendOfflineJpalSignals', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const MockComponent = () => {
    useSendOfflineJpalSignals()
    return null
  }

  const signal1 = {
    name: OPEN_PAGE_SIGNAL_NAME,
    pageType: DASHBOARD_ROUTE,
    url: 'https://example.com',
    trackingCode: 'abcdef123456',
    offline: true,
    currentCity: 'muenchen',
    currentLanguage: 'ar',
    systemLanguage: 'de',
    appSettings: {
      allowPushNotifications: true,
      errorTracking: false
    },
    timestamp: '2020-01-20T00:00:00.000Z'
  }
  const signal2 = { ...signal1, pageType: CATEGORIES_ROUTE }
  it('should resend signals if internet is reachable again', async () => {
    const appSettings = new AppSettings()
    await appSettings.pushJpalSignal(signal1)
    await appSettings.pushJpalSignal(signal2)
    mockUseNetInfo.mockImplementation(() => ({
      isInternetReachable: false
    }))
    const { rerender } = render(<MockComponent />)
    expect(sendRequest).not.toHaveBeenCalled()
    mockUseNetInfo.mockImplementation(() => ({
      isInternetReachable: true
    }))
    rerender(<MockComponent />)
    await waitFor(() => expect(sendRequest).toHaveBeenCalledTimes(2))
    expect(sendRequest).toHaveBeenCalledWith(signal1)
    expect(sendRequest).toHaveBeenCalledWith(signal2)
    expect(await appSettings.clearJpalSignals()).toEqual([])
  })
  it('should not try to send anything if internet reachability does not change', async () => {
    const appSettings = new AppSettings()
    await appSettings.pushJpalSignal(signal1)
    await appSettings.pushJpalSignal(signal2)
    mockUseNetInfo.mockImplementation(() => ({
      isInternetReachable: true
    }))
    const { rerender } = render(<MockComponent />)
    expect(sendRequest).not.toHaveBeenCalled()
    mockUseNetInfo.mockImplementation(() => ({
      isInternetReachable: true
    }))
    rerender(<MockComponent />)
    expect(sendRequest).not.toHaveBeenCalled()
  })
})
