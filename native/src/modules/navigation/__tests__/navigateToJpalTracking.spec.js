// @flow

import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import navigateToJpalTracking from '../navigateToJpalTracking'
import { JPAL_TRACKING_ROUTE } from 'api-client/src/routes'

describe('navigateToJpalTracking', () => {
  it('should navigate to the jpal tracking route with correct parameters', () => {
    const dispatch = jest.fn()
    const trackingCode = 'abcdef123456'
    const navigation = createNavigationScreenPropMock()

    navigateToJpalTracking({ dispatch, navigation, trackingCode })
    expect(navigation.navigate).toHaveBeenCalledWith({
      name: JPAL_TRACKING_ROUTE,
      params: {
        trackingCode
      }
    })
  })
})
