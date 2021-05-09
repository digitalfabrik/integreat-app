// @flow

import type { Dispatch } from 'redux'
import type { FetchPoiActionType, StoreActionType } from '../app/StoreActionType'
import { generateKey } from '../app/generateRouteKey'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { POIS_ROUTE } from 'api-client/src/routes'

const navigateToPois = <T: RoutesType>({
  navigation,
  dispatch,
  cityCode,
  languageCode,
  cityContentPath,
  key = generateKey(),
  forceRefresh = false
}: {|
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>,
  cityCode: string,
  languageCode: string,
  cityContentPath: ?string,
  key?: string,
  forceRefresh?: boolean
|}) => {
  navigation.navigate({ name: POIS_ROUTE, key })

  const fetchPoi: FetchPoiActionType = {
    type: 'FETCH_POI',
    params: {
      city: cityCode,
      language: languageCode,
      path: cityContentPath,
      key,
      criterion: { forceUpdate: forceRefresh, shouldRefreshResources: forceRefresh }
    }
  }

  dispatch(fetchPoi)
}

export default navigateToPois
