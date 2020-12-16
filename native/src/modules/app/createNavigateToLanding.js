// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'

// TODO remove
export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationPropType<RoutesType>) => () => {
  navigation.navigate('Landing')
  dispatch({ type: 'CLEAR_CITY' })
}
