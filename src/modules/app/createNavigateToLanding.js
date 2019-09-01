// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationScreenProp } from 'react-navigation'

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationScreenProp<*>) => () => {
  navigation.navigate('Landing')
  dispatch({ type: 'CLEAR_CITY' })
}
