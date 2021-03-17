// @flow

import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import navigateToJpalEvaluation from '../navigateToJpalEvaluation'
import { JPAL_EVALUATION_ROUTE } from 'api-client/src/routes'

describe('navigateToJpalEvaluation', () => {
  it('should navigate to the jpal evaluation route with correct parameters', () => {
    const dispatch = jest.fn()
    const trackingCode = 'abcdef123456'
    const navigation = createNavigationScreenPropMock()

    navigateToJpalEvaluation({ dispatch, navigation, trackingCode })
    expect(navigation.navigate).toHaveBeenCalledWith({
      name: JPAL_EVALUATION_ROUTE,
      params: {
        trackingCode
      }
    })
  })
})
