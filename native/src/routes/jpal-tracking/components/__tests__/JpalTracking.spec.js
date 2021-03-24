// @flow

import React from 'react'
import JpalTracking from '../JpalTracking'
import lightTheme from '../../../../modules/theme/constants'
import { fireEvent, render } from '@testing-library/react-native'
import createNavigationMock from '../../../../testing/createNavigationPropMock'
import AsyncStorage from '@react-native-community/async-storage'
import type { RoutePropType } from '../../../../modules/app/constants/NavigationTypes'
import type { JpalTrackingRouteType } from 'api-client'
import { JPAL_TRACKING_ROUTE } from 'api-client'

jest.mock('@react-native-community/async-storage')

describe('JpalTracking', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await AsyncStorage.clear()
  })
  const t = key => key
  const navigation = createNavigationMock()
  const route: RoutePropType<JpalTrackingRouteType> = {
    key: 'route-id-0',
    params: { trackingCode: 'abc' },
    name: JPAL_TRACKING_ROUTE
  }

  it('Textfield should not be editable, when tracking is disabled', async () => {
    const { findByTestId } = render(<JpalTracking theme={lightTheme} t={t} route={route} navigation={navigation} />)

    AsyncStorage.setItem('jpalTrackingEnabled', true, async () => {
      const switchElem = await findByTestId('switch')
      let inputElem = await findByTestId('input')

      expect(Object.prototype.hasOwnProperty.call(inputElem, 'editable')).toBeTrue()
      fireEvent(switchElem, 'onValueChange', false)
      inputElem = findByTestId('input')
      expect(Object.prototype.hasOwnProperty.call(inputElem, 'editable')).toBeFalse()
    })
  })
})
