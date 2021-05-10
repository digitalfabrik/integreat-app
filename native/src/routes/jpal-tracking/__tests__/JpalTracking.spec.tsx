import React from 'react'
import JpalTracking from '../JpalTracking'
import { fireEvent, render } from '@testing-library/react-native'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import AsyncStorage from '@react-native-community/async-storage'
import type { RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import type { JpalTrackingRouteType } from 'api-client'
import { JPAL_TRACKING_ROUTE } from 'api-client'
import AppSettings from '../../../modules/settings/AppSettings'
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
  const navigation = createNavigationMock()
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
    expect(inputElem.props.editable).toBeTrue()
    const switchElem = await findByTestId('switch')
    await fireEvent(switchElem, 'onValueChange')
    inputElem = await findByTestId('input')
    expect(Object.prototype.hasOwnProperty.call(inputElem, 'editable')).toBeFalse()
  })
})
