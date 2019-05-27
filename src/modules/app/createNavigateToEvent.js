// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationScreenProp } from 'react-navigation'
import { generateKey } from './generateRouteKey'

export default (
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationScreenProp<*>
) => (cityCode: string, language: string, path?: string, forceUpdate: boolean = false, key: string = generateKey()) => {
  navigation.navigate({
    routeName: 'Events',
    params: {
      cityCode,
      key,
      onRouteClose: () => dispatch({type: 'CLEAR_EVENT', params: {key}}),
      sharePath: path || `/${cityCode}/${language}/events`
    },
    key
  })

  return dispatch({
    type: 'FETCH_EVENT',
    params: {city: cityCode, language, path, key, forceUpdate}
  })
}
