// @flow

import type { Dispatch } from 'redux'
import type { FetchEventActionType, StoreActionType } from './StoreActionType'
import type { NavigationScreenProp } from 'react-navigation'
import { generateKey } from './generateRouteKey'

export type NavigateToEventParamsType =
  {| cityCode: string, language: string, path?: string, key?: string, forceUpdate?: boolean, peek?: boolean |}

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationScreenProp<*>) => (
  {
    cityCode, language, path, key = generateKey(), forceUpdate = false, peek = false
  }: NavigateToEventParamsType) => {
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

  const fetchEvent: FetchEventActionType = {
    type: 'FETCH_EVENT',
    params: {
      city: cityCode,
      language,
      path,
      key,
      criterion: {forceUpdate, shouldRefreshResources: false, peek, contentType: 'all'}
    }
  }

  dispatch(fetchEvent)
}
