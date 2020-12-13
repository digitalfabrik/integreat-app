// @flow

import type { Dispatch } from 'redux'
import type { FetchEventActionType, StoreActionType } from './StoreActionType'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'
import { generateKey } from './generateRouteKey'

export type NavigateToEventParamsType =
  {| cityCode: string, language: string, path: ?string, key?: string, forceRefresh?: boolean |}

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationPropType<RoutesType>) => (
  {
    cityCode, language, path, key = generateKey(), forceRefresh = false
  }: NavigateToEventParamsType) => {
  navigation.navigate({
    routeName: 'Events',
    params: {
      onRouteClose: () => dispatch({ type: 'CLEAR_EVENT', params: { key } }),
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
      criterion: { forceUpdate: forceRefresh, shouldRefreshResources: forceRefresh }
    }
  }

  dispatch(fetchEvent)
}
