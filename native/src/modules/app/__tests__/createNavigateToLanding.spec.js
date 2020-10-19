// @flow

import createNavigationScreenPropMock from '../../../testing/createNavigationStackPropMock'
import createNavigateToLanding from '../createNavigateToLanding'
import type { StoreActionType } from '../StoreActionType'
import type { Dispatch } from 'redux'

describe('createNavigateToLanding', () => {
  it('should navigate to Landing before dispatching clear action', () => {
    const callOrder = []
    const dispatch: Dispatch<StoreActionType> = jest.fn(action => {
      callOrder.push('dispatch')
      return action
    })
    const navigation = createNavigationScreenPropMock()
    navigation.navigate = jest.fn(() => {
      callOrder.push('navigate')
      return true
    })

    const navigateToLanding = createNavigateToLanding(dispatch, navigation)
    navigateToLanding()
    expect(navigation.navigate).toHaveBeenCalledWith('Landing')
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_CITY' })
    expect(callOrder).toEqual(['navigate', 'dispatch'])
  })
})
