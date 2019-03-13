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
      onRouteClose: () => dispatch({type: 'CLEAR_CATEGORY', params: {key}})
    },
    // Use key when navigating to Categories. Else a new route is not pushed
    key: routeName === 'Categories' ? key : undefined /* Explanaition for "key":
                                                         https://reactnavigation.org/docs/en/navigation-key.html */
  })

  return dispatch({
    type: 'FETCH_CATEGORY',
    params: {city: cityCode, language, pushParams: {path, depth: 2, key}}
  })
}
