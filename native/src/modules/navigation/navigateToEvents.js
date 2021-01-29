// @flow

import type { Dispatch } from 'redux'
import type { FetchEventActionType, StoreActionType } from '../app/StoreActionType'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { generateKey } from '../app/generateRouteKey'
import { EVENTS_ROUTE } from 'api-client/src/routes'
import { cityContentUrl, url } from './url'

const navigateToEvents = <T: RoutesType>({
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
    name: EVENTS_ROUTE,
    params: {
      shareUrl
    },
    key
  })

  const fetchEvent: FetchEventActionType = {
    type: 'FETCH_EVENT',
    params: {
      city: cityCode,
      language: languageCode,
      path: cityContentPath,
      key,
      criterion: { forceUpdate: forceRefresh, shouldRefreshResources: forceRefresh }
    }
  }

  dispatch(fetchEvent)
}

export default navigateToEvents
