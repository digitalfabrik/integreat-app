// @flow

import createNavigationScreenPropMock from '../../test-utils/createNavigationScreenPropMock'
import createNavigateToExtras from '../createNavigateToExtras'

describe('createNavigateToExtras', () => {
  it('should navigate to the Extras route with correct parameters', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToExtras = createNavigateToExtras(dispatch, navigation)
    navigateToExtras({ cityCode: 'augsburg', language: 'de' })
    expect(navigation.navigate).toHaveBeenCalledWith({
      routeName: 'Extras',
      params: {
        sharePath: '/augsburg/de/extras',
        cityCode: 'augsburg'
      }
    })
  })
})
