// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationPropType, RoutesType } from './constants/NavigationTypes'
import { LANDING_ROUTE } from './constants/NavigationTypes'

const createNavigateToLanding = <T: RoutesType>(
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>
) => () => {
    // We have to clear the whole navigation state if navigating to the landing route.
    // Otherwise there would still be open routes from the last city in the new city.
    navigation.reset({
      index: 1,
      routes: [
        { name: LANDING_ROUTE }
      ]
    })
    dispatch({ type: 'CLEAR_CITY' })
  }

export default createNavigateToLanding
