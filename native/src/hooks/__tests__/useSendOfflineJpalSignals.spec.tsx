import { useNetInfo, NetInfoStateType } from '@react-native-community/netinfo'
import { render, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { CATEGORIES_ROUTE, OPEN_PAGE_SIGNAL_NAME, SignalType } from 'shared'

import TestingAppContext from '../../testing/TestingAppContext'
import { sendRequest } from '../../utils/sendTrackingSignal'
import useSendOfflineJpalSignals from '../useSendOfflineJpalSignals'

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: jest.fn(),
}))

jest.mock('../../utils/sendTrackingSignal')

describe('useSendOfflineJpalSignals', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const updateSettings = jest.fn()

  const MockComponent = () => {
    useSendOfflineJpalSignals()
    return null
  }

  const Wrapper = ({ jpalSignals }: { jpalSignals: SignalType[] }) => (
    <TestingAppContext settings={{ jpalSignals }} updateSettings={updateSettings}>
      <MockComponent />
    </TestingAppContext>
  )

  const signal1 = {
    name: OPEN_PAGE_SIGNAL_NAME,
    pageType: CATEGORIES_ROUTE,
    url: 'https://example.com',
    trackingCode: 'abcdef123456',
    offline: true,
    currentCity: 'muenchen',
    currentLanguage: 'ar',
    systemLanguage: 'de',
    appSettings: {
      allowPushNotifications: true,
      errorTracking: false,
    },
    timestamp: '2020-01-20T00:00:00.000Z',
  }
  const signal2 = { ...signal1, pageType: CATEGORIES_ROUTE }

  const mockedUseNetInfo = mocked(useNetInfo)

  const mockUseNetInfo = (isInternetReachable: boolean) => {
    mockedUseNetInfo.mockImplementation(() => ({
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      type: NetInfoStateType?.other,
      isConnected: true,
      isInternetReachable,
      details: {
        isConnectionExpensive: false,
      },
    }))
  }

  it('should resend signals if internet is reachable again', async () => {
    mockUseNetInfo(false)

    const { rerender } = render(<Wrapper jpalSignals={[signal1, signal2]} />)
    expect(sendRequest).not.toHaveBeenCalled()

    mockUseNetInfo(true)

    rerender(<Wrapper jpalSignals={[signal1, signal2]} />)
    await waitFor(() => expect(sendRequest).toHaveBeenCalledTimes(2))
    expect(sendRequest).toHaveBeenCalledWith(signal1)
    expect(sendRequest).toHaveBeenCalledWith(signal2)
    expect(updateSettings).toHaveBeenCalledTimes(1)
    expect(updateSettings).toHaveBeenCalledWith({ jpalSignals: [] })
  })

  it('should not try to send anything if internet reachability does not change', async () => {
    mockUseNetInfo(false)

    const { rerender } = render(<Wrapper jpalSignals={[signal1, signal2]} />)
    expect(sendRequest).not.toHaveBeenCalled()

    mockUseNetInfo(false)

    rerender(<Wrapper jpalSignals={[signal1, signal2]} />)
    expect(sendRequest).not.toHaveBeenCalled()
    expect(updateSettings).not.toHaveBeenCalled()
  })
})
