import { useNavigation } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { JpalTrackingRouteType } from 'shared'

import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import JpalTracking from '../JpalTracking'

jest.mock('react-i18next')

jest.mock('@react-navigation/native')

describe('JpalTracking', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const updateSettings = jest.fn()

  const navigation = createNavigationMock<JpalTrackingRouteType>()
  mocked(useNavigation).mockImplementation(() => navigation as never)

  const renderJpalTracking = (jpalTrackingEnabled: boolean | null = null) =>
    render(
      <TestingAppContext updateSettings={updateSettings} settings={{ jpalTrackingEnabled }}>
        <JpalTracking navigation={navigation} />
      </TestingAppContext>,
      false,
    )

  it('should enable tracking', async () => {
    const { getByText } = renderJpalTracking(null)
    await waitFor(() => expect(getByText('tracking')).toBeTruthy())

    fireEvent.press(getByText('allowTracking'))

    expect(updateSettings).toHaveBeenCalledTimes(1)
    expect(updateSettings).toHaveBeenCalledWith({ jpalTrackingEnabled: true })
  })

  it('should disable tracking', async () => {
    const { getByText } = renderJpalTracking(true)
    await waitFor(() => expect(getByText('tracking')).toBeTruthy())

    fireEvent.press(getByText('allowTracking'))

    expect(updateSettings).toHaveBeenCalledTimes(1)
    expect(updateSettings).toHaveBeenCalledWith({ jpalTrackingEnabled: false })
  })
})
