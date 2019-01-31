// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from '../app/StoreActionType'
import type { NavigationScreenProp } from 'react-navigation'

export default (routeName: 'Categories' | 'Dashboard', dispatch: Dispatch<StoreActionType>, navigation: NavigationScreenProp<*>) => (cityCode: string, language: string, path: string) => {
  const key = Math.random().toString(36).substr(2, 9)
  navigation.navigate(routeName, {cityCode, key})
  return dispatch({
    type: 'FETCH_CATEGORY',
    params: {city: cityCode, language, selectParams: {path, depth: 2, key}}
  })
}
