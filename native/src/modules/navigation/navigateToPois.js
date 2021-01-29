// @flow

import type { Dispatch } from 'redux'
import type { FetchPoiActionType, StoreActionType } from '../app/StoreActionType'
import { generateKey } from '../app/generateRouteKey'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { EVENTS_ROUTE, POIS_ROUTE } from 'api-client/src/routes'
import { cityContentUrl, url } from './url'

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
  const shareUrl = cityContentPath
    ? url(cityContentPath)
    : cityContentUrl({ cityCode, languageCode, route: EVENTS_ROUTE })
  navigation.navigate({
    name: POIS_ROUTE,
    params: { shareUrl: shareUrl },
    key
  })

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
