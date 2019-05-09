// @flow

import type { Dispatch } from 'redux'
import type { StoreActionType } from './StoreActionType'
import type { NavigationScreenProp } from 'react-navigation'
import { generateKey } from './generateRouteKey'

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationScreenProp<*>) => ({
  cityCode, language, path, previousLanguage = language, forceUpdate = false
}: {|cityCode: string, language: string, path?: string, previousLanguage?: string, forceUpdate?: boolean|}) => {
  const key = generateKey()

  navigation.navigate({
    routeName: 'Events',
    params: {
      cityCode,
      key,
      onRouteClose: () => dispatch({type: 'CLEAR_EVENT', params: {key}})
    },
    key
  })

  return dispatch({
    type: 'FETCH_EVENT',
    params: {city: cityCode, language, path, key, forceUpdate, previousLanguage}
  })
}
