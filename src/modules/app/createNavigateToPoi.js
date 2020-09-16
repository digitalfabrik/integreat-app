// @flow

import type { Dispatch } from 'redux'
import type { FetchPoiActionType, StoreActionType } from './StoreActionType'
import type { NavigationScreenProp } from 'react-navigation'
import { generateKey } from './generateRouteKey'

export type NavigateToPoiParamsType =
  {| cityCode: string, language: string, path: ?string, key?: string, forceRefresh?: boolean |}

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationScreenProp<*>) => (
  {
    cityCode, language, path, key = generateKey(), forceRefresh = false
  }: NavigateToPoiParamsType) => {
  navigation.navigate({
    routeName: 'Pois',
    params: {
      onRouteClose: () => dispatch({ type: 'CLEAR_POI', params: { key } }),
      sharePath: path || `/${cityCode}/${language}/pois`
    },
    key
  })

  const fetchPoi: FetchPoiActionType = {
    type: 'FETCH_POI',
    params: {
      city: cityCode,
      language,
      path,
      key,
      criterion: { forceUpdate: forceRefresh, shouldRefreshResources: forceRefresh }
    }
  }

  dispatch(fetchPoi)
}
