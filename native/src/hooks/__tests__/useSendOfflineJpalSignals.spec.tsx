import AppSettings from '../../utils/AppSettings'
import { CATEGORIES_ROUTE, DASHBOARD_ROUTE, OPEN_PAGE_SIGNAL_NAME } from 'api-client'
import React from 'react'
import useSendOfflineJpalSignals from '../useSendOfflineJpalSignals'
import { render, waitFor } from '@testing-library/react-native'
import { sendRequest } from '../../utils/sendTrackingSignal'
import { useNetInfo, NetInfoStateType } from '@react-native-community/netinfo'
import { mocked } from 'ts-jest/utils'

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: jest.fn()
}))

jest.mock('../../utils/sendTrackingSignal')

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

  const mockedUseNetInfo = mocked(useNetInfo)

  const mockUseNetInfo = (isInternetReachable: boolean) => {
    mockedUseNetInfo.mockImplementation(() => {
      return {
        type: NetInfoStateType?.other,
        isConnected: true,
        isInternetReachable,
        details: {
          isConnectionExpensive: false
        }
      }
    })
  }

  it('should resend signals if internet is reachable again', async () => {
    const appSettings = new AppSettings()
    await appSettings.pushJpalSignal(signal1)
    await appSettings.pushJpalSignal(signal2)

    mockUseNetInfo(false)

    const { rerender } = render(<MockComponent />)
    expect(sendRequest).not.toHaveBeenCalled()

    mockUseNetInfo(true)

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

    mockUseNetInfo(true)

    const { rerender } = render(<MockComponent />)
    expect(sendRequest).not.toHaveBeenCalled()

    mockUseNetInfo(true)

    rerender(<MockComponent />)
    expect(sendRequest).not.toHaveBeenCalled()
  })
})
