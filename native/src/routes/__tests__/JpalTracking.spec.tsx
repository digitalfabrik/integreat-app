import AsyncStorage from '@react-native-async-storage/async-storage'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { JPAL_TRACKING_ROUTE, JpalTrackingRouteType } from 'api-client'

import { RoutePropType } from '../../constants/NavigationTypes'
import createNavigationMock from '../../testing/createNavigationPropMock'
import appSettings from '../../utils/AppSettings'
import JpalTracking from '../JpalTracking'

jest.mock('react-i18next')

describe('JpalTracking', () => {
  beforeEach(() => {
    AsyncStorage.clear()
    jest.clearAllMocks()
  })

  const navigation = createNavigationMock<JpalTrackingRouteType>()
  const route: RoutePropType<JpalTrackingRouteType> = {
    key: 'route-id-0',
    params: {
      trackingCode: 'abc'
    },
    name: JPAL_TRACKING_ROUTE
  }

  it('Textfield should get editable, when tracking is enabled', async () => {
    await appSettings.setJpalTrackingEnabled(true)
    const { findByTestId, getByA11yRole } = render(<JpalTracking route={route} navigation={navigation} />)
    let inputElem = await findByTestId('input')
    expect(inputElem.props.editable).toBeTruthy()
    const switchElem = getByA11yRole('switch')
    await fireEvent(switchElem, 'onValueChange')
    inputElem = await findByTestId('input')
    expect(Object.prototype.hasOwnProperty.call(inputElem, 'editable')).toBeFalsy()
  })
})
