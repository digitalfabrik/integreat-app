// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationScreenProp } from 'react-navigation'
import { generateKey } from './generateRouteKey'

export default (
  routeName: 'Categories' | 'Dashboard',
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationScreenProp<*>
) => (cityCode: string, language: string, path: string) => {
  const key = generateKey()

  navigation.navigate({
    routeName,
    params: {
      cityCode,
      key,
      onDidBlur: () => dispatch({type: 'CLEAR_CATEGORY', params: {key}})
    },
    key: routeName === 'Categories' ? key : undefined
  })

  return dispatch({
    type: 'FETCH_CATEGORY',
    params: {city: cityCode, language, pushParams: {path, depth: 2, key}}
  })
}
