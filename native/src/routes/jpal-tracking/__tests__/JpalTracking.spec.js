// @flow

import React from 'react'
import JpalTracking from '../JpalTracking'
import { act, render } from '@testing-library/react-native'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import AsyncStorage from '@react-native-community/async-storage'
import type { RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import type { JpalTrackingRouteType } from 'api-client'
import { JPAL_TRACKING_ROUTE } from 'api-client'
import AppSettings from '../../../modules/settings/AppSettings'

jest.mock('@react-native-community/async-storage')
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { language: 'ckb' } })
}))

describe('JpalTracking', () => {
  beforeEach(() => {
    AsyncStorage.clear()
    jest.clearAllMocks()
  })

  const navigation = createNavigationMock()
  const route: RoutePropType<JpalTrackingRouteType> = {
    key: 'route-id-0',
    params: { trackingCode: 'abc' },
    name: JPAL_TRACKING_ROUTE
  }

  // Error: Unable to find node on an unmounted component.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Textfield should not be editable, when tracking is disabled', async () => {
    await act(async () => {
      const appSettings = new AppSettings()
      await appSettings.setJpalTrackingEnabled(true)
      const { findByTestId } = render(<JpalTracking route={route} navigation={navigation} />)
      const inputElem = await findByTestId('input')
      expect(Object.prototype.hasOwnProperty.call(inputElem, 'editable')).toBeTrue()
    })
  })
})
