import React from 'react'
import JpalTracking from '../JpalTracking'
import { fireEvent, render } from '@testing-library/react-native'
import createNavigationMock from '../../testing/createNavigationPropMock'
import AsyncStorage from '@react-native-community/async-storage'
import { RoutePropType } from '../../constants/NavigationTypes'
import { JPAL_TRACKING_ROUTE, JpalTrackingRouteType } from 'api-client'
import AppSettings from '../../utils/AppSettings'

jest.mock('@react-native-community/async-storage')
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: jest.fn()
  })
}))

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
    const appSettings = new AppSettings()
    await appSettings.setJpalTrackingEnabled(true)
    const { findByTestId } = render(<JpalTracking route={route} navigation={navigation} />)
    let inputElem = await findByTestId('input')
    expect(inputElem.props.editable).toBeTruthy()
    const switchElem = await findByTestId('switch')
    await fireEvent(switchElem, 'onValueChange')
    inputElem = await findByTestId('input')
    expect(Object.prototype.hasOwnProperty.call(inputElem, 'editable')).toBeFalsy()
  })
})
