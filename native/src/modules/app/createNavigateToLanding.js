// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationStackProp } from 'react-navigation-stack'

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationStackProp<*>) => () => {
  navigation.navigate('Landing')
  dispatch({ type: 'CLEAR_CITY' })
}
