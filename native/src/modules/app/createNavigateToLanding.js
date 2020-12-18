// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'
import { LANDING_ROUTE } from './components/NavigationTypes'

const createNavigateToLanding = <T: RoutesType>(
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>
) => () => {
    navigation.replace(LANDING_ROUTE)
    dispatch({ type: 'CLEAR_CITY' })
  }

export default createNavigateToLanding
