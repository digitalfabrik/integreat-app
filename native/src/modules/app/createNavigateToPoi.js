// @flow

import type { Dispatch } from 'redux'
import type { FetchPoiActionType, StoreActionType } from './StoreActionType'
import { generateKey } from './generateRouteKey'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'
import { POIS_ROUTE } from './components/NavigationTypes'

export type NavigateToPoiParamsType =
  {| cityCode: string, language: string, path: ?string, key?: string, forceRefresh?: boolean |}

const createNavigateToPoi = <T: RoutesType>(
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>
) => ({ cityCode, language, path, key = generateKey(), forceRefresh = false }: NavigateToPoiParamsType) => {
    navigation.navigate({
      routeName: POIS_ROUTE,
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

export default createNavigateToPoi
