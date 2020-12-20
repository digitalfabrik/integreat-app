// @flow

import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import createNavigateToOffers from '../createNavigateToOffers'

describe('createNavigateToOffers', () => {
  it('should navigate to the Offers route with correct parameters', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToOffers = createNavigateToOffers(dispatch, navigation)
    navigateToOffers({ cityCode: 'augsburg', language: 'de' })
    expect(navigation.navigate).toHaveBeenCalledWith({
      routeName: 'Offers',
      params: {
        sharePath: '/augsburg/de/offers',
        cityCode: 'augsburg'
      }
    })
  })
})
